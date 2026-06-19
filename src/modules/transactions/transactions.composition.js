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

export const makeCreateTransactionController = () => {
    const cacheService = getCacheService()
    const createTransactionRepository =
        new PostgresCreateTransactionRepository()
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const idGeneratorAdapter = new IdGeneratorAdapter()
    const createTransactionUseCase = new CreateTransactionUseCase(
        createTransactionRepository,
        getUserByIdRepository,
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
