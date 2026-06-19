import { UnauthorizedError } from '../errors/index.js'
import {
    buildRefreshToken,
    generateRefreshTokenSecret,
    getRefreshTokenExpiryDate,
    parseRefreshToken,
} from '../utils/refresh-token.js'

export class AuthTokenService {
    constructor(
        tokensGeneratorAdapter,
        tokenHasherAdapter,
        idGeneratorAdapter,
        refreshTokenSessionRepository,
    ) {
        this.tokensGeneratorAdapter = tokensGeneratorAdapter
        this.tokenHasherAdapter = tokenHasherAdapter
        this.idGeneratorAdapter = idGeneratorAdapter
        this.refreshTokenSessionRepository = refreshTokenSessionRepository
    }

    async issueTokens(userId) {
        const sessionId = this.idGeneratorAdapter.execute()
        const secret = generateRefreshTokenSecret()
        const refreshToken = buildRefreshToken(sessionId, secret)
        const tokenHash = await this.tokenHasherAdapter.hash(secret)
        const expiresAt = getRefreshTokenExpiryDate()

        await this.refreshTokenSessionRepository.create({
            id: sessionId,
            userId,
            tokenHash,
            expiresAt,
        })

        return {
            accessToken:
                this.tokensGeneratorAdapter.generateAccessToken(userId),
            refreshToken,
        }
    }

    async rotateRefreshToken(refreshToken) {
        const parsed = parseRefreshToken(refreshToken)

        if (!parsed) {
            throw new UnauthorizedError()
        }

        const session = await this.refreshTokenSessionRepository.findById(
            parsed.sessionId,
        )

        if (!session) {
            throw new UnauthorizedError()
        }

        if (session.revoked_at) {
            await this.refreshTokenSessionRepository.revokeAllByUserId(
                session.user_id,
            )
            throw new UnauthorizedError()
        }

        if (session.expires_at <= new Date()) {
            throw new UnauthorizedError()
        }

        const isValidSecret = await this.tokenHasherAdapter.compare(
            parsed.secret,
            session.token_hash,
        )

        if (!isValidSecret) {
            throw new UnauthorizedError()
        }

        const tokens = await this.issueTokens(session.user_id)
        const newSessionId = parseRefreshToken(tokens.refreshToken).sessionId

        await this.refreshTokenSessionRepository.revoke(
            session.id,
            newSessionId,
        )

        return tokens
    }

    async revokeRefreshToken(refreshToken) {
        const parsed = parseRefreshToken(refreshToken)

        if (!parsed) {
            throw new UnauthorizedError()
        }

        const session = await this.refreshTokenSessionRepository.findById(
            parsed.sessionId,
        )

        if (!session || session.revoked_at) {
            throw new UnauthorizedError()
        }

        const isValidSecret = await this.tokenHasherAdapter.compare(
            parsed.secret,
            session.token_hash,
        )

        if (!isValidSecret) {
            throw new UnauthorizedError()
        }

        await this.refreshTokenSessionRepository.revoke(session.id)
    }

    async revokeAllUserSessions(userId) {
        await this.refreshTokenSessionRepository.revokeAllByUserId(userId)
    }
}
