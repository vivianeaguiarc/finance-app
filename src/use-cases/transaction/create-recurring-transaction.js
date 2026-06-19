import { UserNotFoundError } from '../../errors/user.js'
import { InvalidRecurrenceError } from '../../errors/transaction-finance.js'
import {
    assertCategoryOwnership,
    serializeTransactions,
} from '../../utils/finance-helpers.js'
import { generateRecurringDates } from '../../utils/recurring-dates.js'

export class CreateRecurringTransactionUseCase {
    constructor(
        createManyTransactionsRepository,
        getUserByIdRepository,
        getCategoryByIdRepository,
        idGeneratorAdapter,
        cacheService = null,
    ) {
        this.createManyTransactionsRepository = createManyTransactionsRepository
        this.getUserByIdRepository = getUserByIdRepository
        this.getCategoryByIdRepository = getCategoryByIdRepository
        this.idGeneratorAdapter = idGeneratorAdapter
        this.cacheService = cacheService
    }

    async execute(userId, payload) {
        const user = await this.getUserByIdRepository.execute(userId)
        if (!user) {
            throw new UserNotFoundError()
        }

        await assertCategoryOwnership(
            this.getCategoryByIdRepository,
            userId,
            payload.categoryId,
        )

        const dates = generateRecurringDates({
            startDate: payload.date,
            recurrenceType: payload.recurrenceType,
            recurrenceEndDate: payload.recurrenceEndDate,
        })

        if (dates.length === 0) {
            throw new InvalidRecurrenceError(
                'No recurring occurrences could be generated for the given period',
            )
        }

        const parentId = this.idGeneratorAdapter.execute()
        const transactions = dates.map((occurrenceDate, index) => ({
            id: index === 0 ? parentId : this.idGeneratorAdapter.execute(),
            user_id: userId,
            category_id: payload.categoryId ?? null,
            name: payload.name,
            date: occurrenceDate,
            amount: payload.amount,
            type: payload.type,
            is_recurring: index === 0,
            recurrence_type: index === 0 ? payload.recurrenceType : null,
            recurrence_end_date:
                index === 0 && payload.recurrenceEndDate
                    ? new Date(payload.recurrenceEndDate)
                    : null,
            parent_transaction_id: index === 0 ? null : parentId,
            is_installment: false,
        }))

        const created =
            await this.createManyTransactionsRepository.execute(transactions)

        if (this.cacheService) {
            await this.cacheService.invalidateUserCache(userId)
        }

        return {
            parentTransaction: serializeTransactions([created[0]])[0],
            occurrences: serializeTransactions(created),
            totalOccurrences: created.length,
        }
    }
}

export class ListRecurringTransactionsUseCase {
    constructor(listRecurringTransactionsRepository, getUserByIdRepository) {
        this.listRecurringTransactionsRepository =
            listRecurringTransactionsRepository
        this.getUserByIdRepository = getUserByIdRepository
    }

    async execute(userId) {
        const user = await this.getUserByIdRepository.execute(userId)
        if (!user) {
            throw new UserNotFoundError()
        }

        const items =
            await this.listRecurringTransactionsRepository.execute(userId)

        return items.map((item) => ({
            ...serializeTransactions([item])[0],
            generatedOccurrences: item._count.children,
        }))
    }
}
