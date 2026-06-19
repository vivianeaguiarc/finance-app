import {
    CreateUserController,
    LoginUserController,
    RefreshTokenController,
    LogoutUserController,
    LogoutAllSessionsController,
} from './auth.controller.js'
import {
    CreateUserUseCase,
    LoginUserUseCase,
    RefreshTokenUseCase,
    LogoutUserUseCase,
    LogoutAllSessionsUseCase,
} from './auth.service.js'
import {
    PostgresCreateUserRepository,
    PostgresGetUserByEmailRepository,
} from './auth.repository.js'
import {
    IdGeneratorAdapter,
    PasswordComparatorAdapter,
    PasswordHasherAdapter,
} from '../../adapters/index.js'
import { makeAuthTokenService } from '../../services/auth-token-service.factory.js'

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

    return new CreateUserController(createUserUseCase)
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

    return new LoginUserController(loginUserUseCase)
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
