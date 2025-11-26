import { UnauthorizedError } from '../../errors/index.js'

export class RefreshTokenUseCase {
    constructor(tokensGeneratorAdapter, tokenVerifierAdapter) {
        this.tokensGeneratorAdapter = tokensGeneratorAdapter
        this.tokenVerifierAdapter = tokenVerifierAdapter
    }

    execute(refreshToken) {
        const decodedToken = this.tokenVerifierAdapter.execute(
            refreshToken,
            process.env.JWT_REFRESH_SECRET,
        )

        if (!decodedToken) {
            throw new UnauthorizedError()
        }

        return this.tokensGeneratorAdapter.execute(decodedToken.userId)
    }
}
