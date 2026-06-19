import { UnauthorizedError } from '../../errors/index.js'

export class LogoutUserUseCase {
    constructor(authTokenService) {
        this.authTokenService = authTokenService
    }

    async execute(refreshToken) {
        try {
            await this.authTokenService.revokeRefreshToken(refreshToken)
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                throw error
            }

            throw new UnauthorizedError()
        }
    }
}
