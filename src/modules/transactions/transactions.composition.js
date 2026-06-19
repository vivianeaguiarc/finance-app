import {
    CreateTransactionController,
    GetTransactionByUserIdController,
    UpdateTransactionController,
    DeleteTransactionController,
    GetTransactionBalanceController,
} from './transactions.controller.js'
import {
    CreateTransactionUseCase,
    GetTransactionByUserIdUseCase,
    UpdateTransactionUseCase,
    DeleteTransactionUseCase,
    GetTransactionBalanceUseCase,
} from './transactions.service.js'
import {
    PostgresCreateTransactionRepository,
    PostgresGetTransactionsByUserIdRepository,
    PostgresUpdateTransactionRepository,
    PostgresDeleteTransactionRepository,
    PostgresGetTransactionBalanceRepository,
    PostgresGetTransactionByIdRepository,
    PostgresGetUserByIdRepository,
} from './transactions.repository.js'
import { IdGeneratorAdapter } from '../../adapters/index.js'
import { getCacheService } from '../../adapters/cache-service.js'
import { PostgresGetCategoryByIdRepository } from '../categories/categories.repository.js'
import { PostgresCreateManyTransactionsRepository } from '../../repositories/postgres/transaction/create-many-transactions.js'
import { PostgresListRecurringTransactionsRepository } from '../../repositories/postgres/transaction/list-recurring-transactions.js'
import { CreateInstallmentTransactionUseCase } from '../../use-cases/transaction/create-installment-transaction.js'
import {
    CreateRecurringTransactionUseCase,
    ListRecurringTransactionsUseCase,
} from '../../use-cases/transaction/create-recurring-transaction.js'
import { CreateInstallmentTransactionController } from '../../controllers/transaction/create-installment-transaction.js'
import {
    CreateRecurringTransactionController,
    ListRecurringTransactionsController,
} from '../../controllers/transaction/create-recurring-transaction.js'

export const makeCreateInstallmentTransactionController = () => {
    const cacheService = getCacheService()

    return new CreateInstallmentTransactionController(
        new CreateInstallmentTransactionUseCase(
            new PostgresCreateManyTransactionsRepository(),
            new PostgresGetUserByIdRepository(),
            new PostgresGetCategoryByIdRepository(),
            new IdGeneratorAdapter(),
            cacheService,
        ),
    )
}

export const makeCreateRecurringTransactionController = () => {
    const cacheService = getCacheService()

    return new CreateRecurringTransactionController(
        new CreateRecurringTransactionUseCase(
            new PostgresCreateManyTransactionsRepository(),
            new PostgresGetUserByIdRepository(),
            new PostgresGetCategoryByIdRepository(),
            new IdGeneratorAdapter(),
            cacheService,
        ),
    )
}

export const makeListRecurringTransactionsController = () =>
    new ListRecurringTransactionsController(
        new ListRecurringTransactionsUseCase(
            new PostgresListRecurringTransactionsRepository(),
            new PostgresGetUserByIdRepository(),
        ),
    )

export const makeCreateTransactionController = () => {
    const cacheService = getCacheService()
    const createTransactionRepository =
        new PostgresCreateTransactionRepository()
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const getCategoryByIdRepository = new PostgresGetCategoryByIdRepository()
    const idGeneratorAdapter = new IdGeneratorAdapter()
    const createTransactionUseCase = new CreateTransactionUseCase(
        createTransactionRepository,
        getUserByIdRepository,
        getCategoryByIdRepository,
        idGeneratorAdapter,
        cacheService,
    )
    return new CreateTransactionController(createTransactionUseCase)
}

export const makeGetTransactionsByUserIdController = () => {
    const cacheService = getCacheService()
    const getTransactionsByUserIdRepository =
        new PostgresGetTransactionsByUserIdRepository()
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const getTransactionsByUserIdUseCase = new GetTransactionByUserIdUseCase(
        getTransactionsByUserIdRepository,
        getUserByIdRepository,
        cacheService,
    )
    return new GetTransactionByUserIdController(getTransactionsByUserIdUseCase)
}

export const makeUpdateTransactionController = () => {
    const cacheService = getCacheService()
    const updateTransactionRepository =
        new PostgresUpdateTransactionRepository()
    const getTransactionByIdRepository =
        new PostgresGetTransactionByIdRepository()
    const updateTransactionUseCase = new UpdateTransactionUseCase(
        updateTransactionRepository,
        getTransactionByIdRepository,
        cacheService,
    )
    return new UpdateTransactionController(updateTransactionUseCase)
}

export const makeDeleteTransactionController = () => {
    const cacheService = getCacheService()
    const deleteTransactionRepository =
        new PostgresDeleteTransactionRepository()
    const getTransactionByIdRepository =
        new PostgresGetTransactionByIdRepository()
    const deleteTransactionUseCase = new DeleteTransactionUseCase(
        deleteTransactionRepository,
        getTransactionByIdRepository,
        cacheService,
    )
    return new DeleteTransactionController(deleteTransactionUseCase)
}

export const makeGetTransactionBalanceController = () => {
    const repo = new PostgresGetTransactionBalanceRepository()
    const useCase = new GetTransactionBalanceUseCase(repo)
    return new GetTransactionBalanceController(useCase)
}
