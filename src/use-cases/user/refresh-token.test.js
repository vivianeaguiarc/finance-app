import { UnauthorizedError } from '../../errors/index.js'
import { RefreshTokenUseCase } from './refresh-token.js'

describe('Refresh Token Use Case', () => {
    class TokenVerifierAdapterStub {
        async execute() {
            return { userId: 'any_user_id' }
        }
    }

    class TokensGeneratorAdapterStub {
        execute() {
            return {
                accessToken: 'any_access_token',
                refreshToken: 'any_refresh_token',
            }
        }
    }

    const makeSut = () => {
        const tokenVerifierAdapter = new TokenVerifierAdapterStub()
        const tokensGeneratorAdapter = new TokensGeneratorAdapterStub()

        const sut = new RefreshTokenUseCase(
            tokensGeneratorAdapter,
            tokenVerifierAdapter,
        )

        return { sut, tokenVerifierAdapter, tokensGeneratorAdapter }
    }

    it('should return new tokens', async () => {
        const { sut } = makeSut()

        const result = await sut.execute('any_refresh_token')

        expect(result).toEqual({
            accessToken: 'any_access_token',
            refreshToken: 'any_refresh_token',
        })
    })

    it('should throw if tokenVerifierAdapter throws', async () => {
        const { sut, tokenVerifierAdapter } = makeSut()

        import.meta.jest
            .spyOn(tokenVerifierAdapter, 'execute')
            .mockImplementationOnce(() => {
                throw new Error()
            })

        await expect(sut.execute('any_refresh_token')).rejects.toThrow(
            UnauthorizedError,
        )
    })
})
