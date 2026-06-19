import {
    CreateMonthlyBudgetController,
    ListMonthlyBudgetsController,
    GetBudgetStatusController,
} from '../../controllers/budget/monthly-budget.js'
import {
    CreateMonthlyBudgetUseCase,
    ListMonthlyBudgetsUseCase,
    GetBudgetStatusUseCase,
} from '../../use-cases/budget/monthly-budget.js'
import {
    PostgresCreateMonthlyBudgetRepository,
    PostgresListMonthlyBudgetsRepository,
    PostgresGetCategorySpentRepository,
} from './budgets.repository.js'
import { PostgresGetCategoryByIdRepository } from '../categories/categories.repository.js'
import { PostgresGetUserByIdRepository } from '../../repositories/postgres/user/get-user-by-id.js'
import { IdGeneratorAdapter } from '../../adapters/index.js'
import { getCacheService } from '../../adapters/cache-service.js'

export const makeCreateMonthlyBudgetController = () =>
    new CreateMonthlyBudgetController(
        new CreateMonthlyBudgetUseCase(
            new PostgresCreateMonthlyBudgetRepository(),
            new PostgresGetUserByIdRepository(),
            new PostgresGetCategoryByIdRepository(),
            new IdGeneratorAdapter(),
            getCacheService(),
        ),
    )

export const makeListMonthlyBudgetsController = () =>
    new ListMonthlyBudgetsController(
        new ListMonthlyBudgetsUseCase(
            new PostgresListMonthlyBudgetsRepository(),
            new PostgresGetUserByIdRepository(),
        ),
    )

export const makeGetBudgetStatusController = () =>
    new GetBudgetStatusController(
        new GetBudgetStatusUseCase(
            new PostgresListMonthlyBudgetsRepository(),
            new PostgresGetCategorySpentRepository(),
            new PostgresGetUserByIdRepository(),
        ),
    )
