import {
    createMonthlyBudgetSchema,
    listBudgetsQuerySchema,
    budgetStatusQuerySchema,
} from '../../schemas/budget.js'
import {
    created,
    ok,
    mapErrorToHttpResponse,
    userNotFoundResponse,
} from '../helpers/index.js'
import {
    BudgetAlreadyExistsError,
    CategoryForbiddenError,
    CategoryNotFoundError,
    UserNotFoundError,
} from '../../errors/index.js'

function serializeBudget(budget) {
    return {
        id: budget.id,
        userId: budget.user_id,
        categoryId: budget.category_id,
        categoryName: budget.category?.name,
        month: budget.month,
        year: budget.year,
        limitAmount: String(budget.limit_amount),
        createdAt: budget.created_at?.toISOString?.() ?? budget.created_at,
    }
}

export class CreateMonthlyBudgetController {
    constructor(createMonthlyBudgetUseCase) {
        this.createMonthlyBudgetUseCase = createMonthlyBudgetUseCase
    }

    async execute(httpRequest) {
        try {
            const body = await createMonthlyBudgetSchema.parseAsync(
                httpRequest.body,
            )

            const budget = await this.createMonthlyBudgetUseCase.execute(
                httpRequest.userId,
                body,
            )

            return created(
                serializeBudget(budget),
                'Monthly budget created successfully',
            )
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            if (
                error instanceof CategoryNotFoundError ||
                error instanceof CategoryForbiddenError ||
                error instanceof BudgetAlreadyExistsError
            ) {
                return mapErrorToHttpResponse(error, httpRequest)
            }

            return mapErrorToHttpResponse(error, httpRequest)
        }
    }
}

export class ListMonthlyBudgetsController {
    constructor(listMonthlyBudgetsUseCase) {
        this.listMonthlyBudgetsUseCase = listMonthlyBudgetsUseCase
    }

    async execute(httpRequest) {
        try {
            const filters = await listBudgetsQuerySchema.parseAsync(
                httpRequest.query ?? {},
            )

            const budgets = await this.listMonthlyBudgetsUseCase.execute(
                httpRequest.userId,
                filters,
            )

            return ok(
                budgets.map(serializeBudget),
                'Monthly budgets retrieved successfully',
            )
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            return mapErrorToHttpResponse(error, httpRequest)
        }
    }
}

export class GetBudgetStatusController {
    constructor(getBudgetStatusUseCase) {
        this.getBudgetStatusUseCase = getBudgetStatusUseCase
    }

    async execute(httpRequest) {
        try {
            const query = await budgetStatusQuerySchema.parseAsync(
                httpRequest.query ?? {},
            )

            const status = await this.getBudgetStatusUseCase.execute(
                httpRequest.userId,
                query,
            )

            return ok(status, 'Budget status retrieved successfully')
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            return mapErrorToHttpResponse(error, httpRequest)
        }
    }
}
