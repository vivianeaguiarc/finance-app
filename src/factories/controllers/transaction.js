import {
    CreateTransactionController,
    GetTransactionByUserIdController,
    UpdateTransactionController,
    DeleteTransactionController,
    GetTransactionBalanceController,
} from '../../controllers/index.js'
import {
    PostgresCreateTransactionRepository,
    PostgresGetUserByIdRepository,
    PostgresGetTransactionsByUserIdRepository,
    PostgresUpdateTransactionRepository,
    PostgresDeleteTransactionRepository,
    PostgresGetTransactionBalanceRepository,
    PostgresGetTransactionByIdRepository,
} from '../../repositories/postgres/index.js'
import {
    CreateTransactionUseCase,
    GetTransactionByUserIdUseCase,
    UpdateTransactionUseCase,
    DeleteTransactionUseCase,
    GetTransactionBalanceUseCase,
} from '../../use-cases/index.js'
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
    const createTransactionController = new CreateTransactionController(
        createTransactionUseCase,
    )
    return createTransactionController
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
    const getTransactionByUserIdController =
        new GetTransactionByUserIdController(getTransactionsByUserIdUseCase)
    return getTransactionByUserIdController
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
    const updateTransactionController = new UpdateTransactionController(
        updateTransactionUseCase,
    )
    return updateTransactionController
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
    const deleteTransactionController = new DeleteTransactionController(
        deleteTransactionUseCase,
    )
    return deleteTransactionController
}
export const makeGetTransactionBalanceController = () => {
    const repo = new PostgresGetTransactionBalanceRepository()
    const useCase = new GetTransactionBalanceUseCase(repo)
    return new GetTransactionBalanceController(useCase)
}
