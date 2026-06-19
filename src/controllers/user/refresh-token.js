import { ok, unauthorized, mapErrorToHttpResponse } from '../helpers/index.js'
import { refreshTokenSchema } from '../../schemas/index.js'
import { UnauthorizedError } from '../../errors/index.js'

export class RefreshTokenController {
    constructor(refreshTokenUseCase) {
        this.refreshTokenUseCase = refreshTokenUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            await refreshTokenSchema.parseAsync(params)

            const tokens = await this.refreshTokenUseCase.execute(
                params.refreshToken,
            )

            return ok(tokens, 'Token refreshed successfully')
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                return unauthorized(
                    'Invalid or expired refresh token.',
                    'INVALID_REFRESH_TOKEN',
                )
            }

            return mapErrorToHttpResponse(error)
        }
    }
}
