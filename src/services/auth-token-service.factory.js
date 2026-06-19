import {
    TokensGeneratorAdapter,
    TokenHasherAdapter,
    IdGeneratorAdapter,
} from '../adapters/index.js'
import { PostgresRefreshTokenSessionRepository } from '../repositories/postgres/refresh-token-session/refresh-token-session.js'
import { AuthTokenService } from './auth-token-service.js'

export function makeAuthTokenService() {
    return new AuthTokenService(
        new TokensGeneratorAdapter(),
        new TokenHasherAdapter(),
        new IdGeneratorAdapter(),
        new PostgresRefreshTokenSessionRepository(),
    )
}
