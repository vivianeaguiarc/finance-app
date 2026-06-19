import { UserNotFoundError } from '../../errors/user.js'
import { assertCategoryOwnership } from '../../utils/finance-helpers.js'
import { calculateBudgetStatus } from '../../utils/budget-status.js'

export class CreateMonthlyBudgetUseCase {
    constructor(
        createMonthlyBudgetRepository,
        getUserByIdRepository,
        getCategoryByIdRepository,
        idGeneratorAdapter,
        cacheService = null,
    ) {
        this.createMonthlyBudgetRepository = createMonthlyBudgetRepository
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

        const budget = await this.createMonthlyBudgetRepository.execute({
            id: this.idGeneratorAdapter.execute(),
            userId,
            categoryId: payload.categoryId,
            month: payload.month,
            year: payload.year,
            limitAmount: payload.limitAmount,
        })

        if (this.cacheService) {
            await this.cacheService.invalidateUserCache(userId)
        }

        return budget
    }
}

export class ListMonthlyBudgetsUseCase {
    constructor(listMonthlyBudgetsRepository, getUserByIdRepository) {
        this.listMonthlyBudgetsRepository = listMonthlyBudgetsRepository
        this.getUserByIdRepository = getUserByIdRepository
    }

    async execute(userId, filters) {
        const user = await this.getUserByIdRepository.execute(userId)
        if (!user) {
            throw new UserNotFoundError()
        }

        return this.listMonthlyBudgetsRepository.execute(userId, filters)
    }
}

export class GetBudgetStatusUseCase {
    constructor(
        listMonthlyBudgetsRepository,
        getCategorySpentRepository,
        getUserByIdRepository,
    ) {
        this.listMonthlyBudgetsRepository = listMonthlyBudgetsRepository
        this.getCategorySpentRepository = getCategorySpentRepository
        this.getUserByIdRepository = getUserByIdRepository
    }

    async execute(userId, { month, year }) {
        const user = await this.getUserByIdRepository.execute(userId)
        if (!user) {
            throw new UserNotFoundError()
        }

        const budgets = await this.listMonthlyBudgetsRepository.execute(
            userId,
            { month, year },
        )

        const alerts = []

        for (const budget of budgets) {
            const spentAmount = await this.getCategorySpentRepository.execute(
                userId,
                budget.category_id,
                month,
                year,
            )

            const status = calculateBudgetStatus(
                budget.limit_amount,
                spentAmount,
            )

            alerts.push({
                budgetId: budget.id,
                categoryId: budget.category_id,
                categoryName: budget.category.name,
                month: budget.month,
                year: budget.year,
                ...status,
            })
        }

        return {
            month,
            year,
            alerts,
        }
    }
}
