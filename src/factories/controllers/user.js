import {
    GetUserByIdController,
    CreateUserController,
    UpdateUserController,
    DeleteUserController,
    GetUserBalanceController,
    LoginUserController,
    RefreshTokenController,
    LogoutUserController,
    LogoutAllSessionsController,
} from '../../controllers/index.js'
import {
    GetUserByIdUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    GetUserBalanceUseCase,
    LoginUserUseCase,
    RefreshTokenUseCase,
    LogoutUserUseCase,
    LogoutAllSessionsUseCase,
} from '../../use-cases/index.js'
import {
    PostgresGetUserByIdRepository,
    PostgresCreateUserRepository,
    PostgresGetUserByEmailRepository,
    PostgresUpdateUserRepository,
    PostgresDeleteUserRepository,
    PostgresGetUserBalanceRepository,
} from '../../repositories/postgres/index.js'
import {
    IdGeneratorAdapter,
    PasswordComparatorAdapter,
    PasswordHasherAdapter,
} from '../../adapters/index.js'
import { getCacheService } from '../../adapters/cache-service.js'
import { makeAuthTokenService } from '../../services/auth-token-service.factory.js'

export const makeGetUserByIdController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)
    const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)
    return getUserByIdController
}

export const makeCreateUserController = () => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
    const passwordHasherAdapter = new PasswordHasherAdapter()
    const idGeneratorAdapter = new IdGeneratorAdapter()
    const authTokenService = makeAuthTokenService()
    const createUserRepository = new PostgresCreateUserRepository()

    const createUserUseCase = new CreateUserUseCase(
        getUserByEmailRepository,
        createUserRepository,
        passwordHasherAdapter,
        idGeneratorAdapter,
        authTokenService,
    )
    const createUserController = new CreateUserController(createUserUseCase)
    return createUserController
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
    const updateUserController = new UpdateUserController(updateUserUseCase)
    return updateUserController
}

export const makeDeleteUserController = () => {
    const deleteUserRepository = new PostgresDeleteUserRepository()
    const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)
    const deleteUserController = new DeleteUserController(deleteUserUseCase)
    return deleteUserController
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
    const getUserBalanceController = new GetUserBalanceController(
        getUserBalanceUseCase,
    )
    return getUserBalanceController
}
export const makeLoginUserController = () => {
    const authTokenService = makeAuthTokenService()
    const passwordComparator = new PasswordComparatorAdapter()
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
    const loginUserUseCase = new LoginUserUseCase(
        getUserByEmailRepository,
        passwordComparator,
        authTokenService,
    )
    const loginUserController = new LoginUserController(loginUserUseCase)
    return loginUserController
}

export const makeRefreshTokenController = () => {
    const authTokenService = makeAuthTokenService()
    const refreshTokenUseCase = new RefreshTokenUseCase(authTokenService)
    return new RefreshTokenController(refreshTokenUseCase)
}

export const makeLogoutUserController = () => {
    const authTokenService = makeAuthTokenService()
    const logoutUserUseCase = new LogoutUserUseCase(authTokenService)
    return new LogoutUserController(logoutUserUseCase)
}

export const makeLogoutAllSessionsController = () => {
    const authTokenService = makeAuthTokenService()
    const logoutAllSessionsUseCase = new LogoutAllSessionsUseCase(
        authTokenService,
    )
    return new LogoutAllSessionsController(logoutAllSessionsUseCase)
}
