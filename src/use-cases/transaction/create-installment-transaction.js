import { UserNotFoundError } from '../../errors/user.js'
import { InvalidInstallmentError } from '../../errors/transaction-finance.js'
import {
    assertCategoryOwnership,
    serializeTransactions,
} from '../../utils/finance-helpers.js'
import {
    splitInstallmentAmounts,
    addMonthsUtc,
} from '../../utils/installment-split.js'

export class CreateInstallmentTransactionUseCase {
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

        if (payload.totalInstallments < 2) {
            throw new InvalidInstallmentError(
                'totalInstallments must be greater than 1',
            )
        }

        const installmentAmounts = splitInstallmentAmounts(
            payload.totalAmount,
            payload.totalInstallments,
        )
        const installmentGroupId = this.idGeneratorAdapter.execute()
        const startDate = new Date(payload.date)
        const transactions = installmentAmounts.map((amount, index) => ({
            id: this.idGeneratorAdapter.execute(),
            user_id: userId,
            category_id: payload.categoryId ?? null,
            name: payload.name,
            date: addMonthsUtc(startDate, index),
            amount,
            type: payload.type,
            is_installment: true,
            installment_number: index + 1,
            total_installments: payload.totalInstallments,
            installment_group_id: installmentGroupId,
            is_recurring: false,
        }))

        const created =
            await this.createManyTransactionsRepository.execute(transactions)

        if (this.cacheService) {
            await this.cacheService.invalidateUserCache(userId)
        }

        return {
            installmentGroupId,
            totalInstallments: payload.totalInstallments,
            totalAmount: payload.totalAmount,
            installments: serializeTransactions(created),
        }
    }
}
