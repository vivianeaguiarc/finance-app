import { ok, unauthorized, mapErrorToHttpResponse } from '../helpers/index.js'
import { refreshTokenSchema } from '../../schemas/index.js'
import { UnauthorizedError } from '../../errors/index.js'

export class LogoutUserController {
    constructor(logoutUserUseCase) {
        this.logoutUserUseCase = logoutUserUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            await refreshTokenSchema.parseAsync(params)

            await this.logoutUserUseCase.execute(params.refreshToken)

            return ok(null, 'Logged out successfully')
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                return unauthorized(
                    'Invalid or expired refresh token.',
                    'INVALID_REFRESH_TOKEN',
                )
            }

            return mapErrorToHttpResponse(error, httpRequest)
        }
    }
}
