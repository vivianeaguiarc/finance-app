import {
    CreateTransactionController,
    GetTransactionByUserIdController,
    UpdateTransactionController,
    DeleteTransactionController,
} from '../../controllers/index.js'
import {
    PostgresCreateTransactionRepository,
    PostgresGetUserByIdRepository,
    PostgresetTransactionsByUserIdRepository,
    PostgresUpdateTransactionRepository,
    PostgresDeleteTransactionRepository,
} from '../../repositories/postgres/index.js'
import {
    CreateTransactionUseCase,
    GetTransactionByUserIdUseCase,
    UpdateTransactionUseCase,
    DeleteTransactionUseCase,
} from '../../use-cases/index.js'

export const makeCreateTransactionController = () => {
    const createTransactionRepository =
        new PostgresCreateTransactionRepository()
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const createTransactionUseCase = new CreateTransactionUseCase(
        createTransactionRepository,
        getUserByIdRepository,
    )
    const createTransactionController = new CreateTransactionController(
        createTransactionUseCase,
    )
    return createTransactionController
}
export const makeGetTransactionsByUserIdController = () => {
    const getTransactionsByUserIdRepository =
        new PostgresetTransactionsByUserIdRepository()
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
    const updateTransactionUseCase = new UpdateTransactionUseCase(
        updateTransactionRepository,
    )
    const updateTransactionController = new UpdateTransactionController(
        updateTransactionUseCase,
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
