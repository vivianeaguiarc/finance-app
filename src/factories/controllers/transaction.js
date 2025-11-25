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
} from '../../repositories/postgres/index.js'
import {
    CreateTransactionUseCase,
    GetTransactionByUserIdUseCase,
    UpdateTransactionUseCase,
    DeleteTransactionUseCase,
    GetTransactionBalanceUseCase,
} from '../../use-cases/index.js'
import { IdGeneratorAdapter } from '../../adapters/index.js'

export const makeCreateTransactionController = () => {
    const createTransactionRepository =
        new PostgresCreateTransactionRepository()
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const idGeneratorAdapter = new IdGeneratorAdapter()
    const createTransactionUseCase = new CreateTransactionUseCase(
        createTransactionRepository,
        getUserByIdRepository,
        idGeneratorAdapter,
    )
    const createTransactionController = new CreateTransactionController(
        createTransactionUseCase,
    )
    return createTransactionController
}
export const makeGetTransactionsByUserIdController = () => {
    const getTransactionsByUserIdRepository =
        new PostgresGetTransactionsByUserIdRepository()
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const getTransactionsByUserIdUseCase = new GetTransactionByUserIdUseCase(
        getTransactionsByUserIdRepository,
        getUserByIdRepository,
    )
    const getTransactionByUserIdController =
        new GetTransactionByUserIdController(getTransactionsByUserIdUseCase)
    return getTransactionByUserIdController
}
export const makeUpdateTransactionController = () => {
    const updateTransactionRepository =
        new PostgresUpdateTransactionRepository()
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const updateTransactionUseCase = new UpdateTransactionUseCase(
        updateTransactionRepository,
        getUserByIdRepository,
    )
    const updateTransactionController = new UpdateTransactionController(
        updateTransactionUseCase,
        getUserByIdRepository,
    )
    return updateTransactionController
}
export const makeDeleteTransactionController = () => {
    const deleteTransactionRepository =
        new PostgresDeleteTransactionRepository()
    const deleteTransactionUseCase = new DeleteTransactionUseCase(
        deleteTransactionRepository,
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
