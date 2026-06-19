import { UnauthorizedError } from '../../errors/index.js'
import { RefreshTokenUseCase } from './refresh-token.js'

describe('Refresh Token Use Case', () => {
    class AuthTokenServiceStub {
        async rotateRefreshToken() {
            return {
                accessToken: 'any_access_token',
                refreshToken: 'any_refresh_token',
            }
        }
    }

    const makeSut = () => {
        const authTokenService = new AuthTokenServiceStub()
        const sut = new RefreshTokenUseCase(authTokenService)

        return { sut, authTokenService }
    }

    it('should return new tokens', async () => {
        const { sut } = makeSut()

        const result = await sut.execute('session-id.secret')

        expect(result).toEqual({
            accessToken: 'any_access_token',
            refreshToken: 'any_refresh_token',
        })
    })

    it('should throw UnauthorizedError when auth token service rejects token', async () => {
        const { sut, authTokenService } = makeSut()

        jest.spyOn(
            authTokenService,
            'rotateRefreshToken',
        ).mockRejectedValueOnce(new UnauthorizedError())

        await expect(sut.execute('invalid-token')).rejects.toThrow(
            UnauthorizedError,
        )
    })
})
