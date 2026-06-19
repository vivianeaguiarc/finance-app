import {
    GetUserByIdController,
    UpdateUserController,
    DeleteUserController,
    GetUserBalanceController,
} from './users.controller.js'
import {
    GetUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    GetUserBalanceUseCase,
} from './users.service.js'
import {
    PostgresGetUserByIdRepository,
    PostgresUpdateUserRepository,
    PostgresDeleteUserRepository,
    PostgresGetUserBalanceRepository,
    PostgresGetUserByEmailRepository,
} from './users.repository.js'
import { PasswordHasherAdapter } from '../../adapters/index.js'
import { getCacheService } from '../../adapters/cache-service.js'

export const makeGetUserByIdController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)
    return new GetUserByIdController(getUserByIdUseCase)
}

export const makeUpdateUserController = () => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
    const updateUserRepository = new PostgresUpdateUserRepository()
    const passwordHasherAdapter = new PasswordHasherAdapter()
    const updateUserUseCase = new UpdateUserUseCase(
        getUserByEmailRepository,
        updateUserRepository,
        passwordHasherAdapter,
    )
    return new UpdateUserController(updateUserUseCase)
}

export const makeDeleteUserController = () => {
    const deleteUserRepository = new PostgresDeleteUserRepository()
    const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)
    return new DeleteUserController(deleteUserUseCase)
}

export const makeGetUserBalanceController = () => {
    const cacheService = getCacheService()
    const getUserBalanceRepository = new PostgresGetUserBalanceRepository()
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const getUserBalanceUseCase = new GetUserBalanceUseCase(
        getUserBalanceRepository,
        getUserByIdRepository,
        cacheService,
    )
    return new GetUserBalanceController(getUserBalanceUseCase)
}
