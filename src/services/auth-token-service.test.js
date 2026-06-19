import { UnauthorizedError } from '../errors/index.js'
import { AuthTokenService } from './auth-token-service.js'
import { buildRefreshToken } from '../utils/refresh-token.js'

describe('AuthTokenService', () => {
    const userId = '7c9e6679-7425-40de-944b-e07fc1f90ae7'
    const sessionId = '8d9e6679-7425-40de-944b-e07fc1f90ae8'
    const secret = 'refresh-secret-value'

    const makeSut = () => {
        const tokensGeneratorAdapter = {
            generateAccessToken: jest.fn().mockReturnValue('access-token'),
        }
        const tokenHasherAdapter = {
            hash: jest.fn().mockResolvedValue('hashed-secret'),
            compare: jest.fn().mockResolvedValue(true),
        }
        const idGeneratorAdapter = {
            execute: jest.fn().mockReturnValue(sessionId),
        }
        const refreshTokenSessionRepository = {
            create: jest.fn().mockResolvedValue({ id: sessionId }),
            findById: jest.fn(),
            revoke: jest.fn().mockResolvedValue({}),
            revokeAllByUserId: jest.fn().mockResolvedValue({ count: 1 }),
        }

        const sut = new AuthTokenService(
            tokensGeneratorAdapter,
            tokenHasherAdapter,
            idGeneratorAdapter,
            refreshTokenSessionRepository,
        )

        return {
            sut,
            tokensGeneratorAdapter,
            tokenHasherAdapter,
            idGeneratorAdapter,
            refreshTokenSessionRepository,
        }
    }

    it('should issue tokens and store hashed refresh secret', async () => {
        const { sut, refreshTokenSessionRepository, tokenHasherAdapter } =
            makeSut()

        const tokens = await sut.issueTokens(userId)

        expect(tokens.accessToken).toBe('access-token')
        expect(tokens.refreshToken).toContain(sessionId)
        expect(tokenHasherAdapter.hash).toHaveBeenCalled()
        expect(refreshTokenSessionRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({
                id: sessionId,
                userId,
                tokenHash: 'hashed-secret',
            }),
        )
    })

    it('should rotate refresh token and revoke previous session', async () => {
        const { sut, refreshTokenSessionRepository } = makeSut()
        const refreshToken = buildRefreshToken(sessionId, secret)
        const newSessionId = '9e9e6679-7425-40de-944b-e07fc1f90ae9'

        refreshTokenSessionRepository.findById.mockResolvedValue({
            id: sessionId,
            user_id: userId,
            token_hash: 'hashed-secret',
            expires_at: new Date(Date.now() + 60_000),
            revoked_at: null,
        })

        jest.spyOn(sut, 'issueTokens').mockResolvedValueOnce({
            accessToken: 'new-access-token',
            refreshToken: buildRefreshToken(newSessionId, 'new-secret'),
        })

        const tokens = await sut.rotateRefreshToken(refreshToken)

        expect(tokens.accessToken).toBe('new-access-token')
        expect(refreshTokenSessionRepository.revoke).toHaveBeenCalledWith(
            sessionId,
            newSessionId,
        )
    })

    it('should reject reused refresh token and revoke all user sessions', async () => {
        const { sut, refreshTokenSessionRepository } = makeSut()
        const refreshToken = buildRefreshToken(sessionId, secret)

        refreshTokenSessionRepository.findById.mockResolvedValue({
            id: sessionId,
            user_id: userId,
            token_hash: 'hashed-secret',
            expires_at: new Date(Date.now() + 60_000),
            revoked_at: new Date(),
            replaced_by_token_id: 'another-session',
        })

        await expect(sut.rotateRefreshToken(refreshToken)).rejects.toThrow(
            UnauthorizedError,
        )
        expect(
            refreshTokenSessionRepository.revokeAllByUserId,
        ).toHaveBeenCalledWith(userId)
    })

    it('should reject expired refresh token', async () => {
        const { sut, refreshTokenSessionRepository } = makeSut()
        const refreshToken = buildRefreshToken(sessionId, secret)

        refreshTokenSessionRepository.findById.mockResolvedValue({
            id: sessionId,
            user_id: userId,
            token_hash: 'hashed-secret',
            expires_at: new Date(Date.now() - 60_000),
            revoked_at: null,
        })

        await expect(sut.rotateRefreshToken(refreshToken)).rejects.toThrow(
            UnauthorizedError,
        )
    })

    it('should revoke refresh token on logout', async () => {
        const { sut, refreshTokenSessionRepository } = makeSut()
        const refreshToken = buildRefreshToken(sessionId, secret)

        refreshTokenSessionRepository.findById.mockResolvedValue({
            id: sessionId,
            user_id: userId,
            token_hash: 'hashed-secret',
            expires_at: new Date(Date.now() + 60_000),
            revoked_at: null,
        })

        await sut.revokeRefreshToken(refreshToken)

        expect(refreshTokenSessionRepository.revoke).toHaveBeenCalledWith(
            sessionId,
        )
    })
})
