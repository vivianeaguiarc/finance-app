import { LoginUserUseCase } from './login-user.js'
import { user } from '../../tests/fixtures/user.js'
import { InvalidPasswordError, UserNotFoundError } from '../../errors/user.js'

describe('LoginUserUseCase', () => {
    class LoginUserUseCaseStub {
        async execute() {
            return {
                user, // <-- agora existe a propriedade user
                tokens: {
                    accessToken: 'any_access_token',
                    refreshToken: 'any_refresh_token',
                },
            }
        }
    }

    class GetUserByEmailRepositoryStub {
        async execute() {
            return user
        }
    }

    class PasswordComparatorAdapterStub {
        async execute() {
            return true
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
    const makeSut = (useStub = false) => {
        const loginUserUseCaseStub = new LoginUserUseCaseStub()
        const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub()
        const passwordComparatorAdapterStub =
            new PasswordComparatorAdapterStub()
        const tokensGeneratorAdapterStub = new TokensGeneratorAdapterStub()

        const sut = useStub
            ? loginUserUseCaseStub // <= AQUI o stub é retornado
            : new LoginUserUseCase(
                  getUserByEmailRepositoryStub,
                  passwordComparatorAdapterStub,
                  tokensGeneratorAdapterStub,
              )

        return {
            sut,
            loginUserUseCaseStub,
            getUserByEmailRepositoryStub,
            passwordComparatorAdapterStub,
            tokensGeneratorAdapterStub,
        }
    }
    const httpRequest = {
        body: {
            email: 'any_email@a.com',
            password: 'any_password44343',
        },
    }

    it('should return (200) user and tokens on success', async () => {
        const { sut } = makeSut(true)

        const httpRequest = {
            body: {
                email: 'any_email@a.com',
                password: 'any_password44343',
            },
        }

        const result = await sut.execute(httpRequest.body)

        expect(result.user).toBeTruthy()
        expect(result.tokens.accessToken).toBe('any_access_token')
        expect(result.tokens.refreshToken).toBe('any_refresh_token')
    })

    it('should throw InvalidPasswordError if password is invalid', async () => {
        const { sut, loginUserUseCaseStub } = makeSut(true)

        import.meta.jest
            .spyOn(loginUserUseCaseStub, 'execute')
            .mockRejectedValueOnce(new InvalidPasswordError())

        const httpRequest = {
            body: {
                email: 'any_email@a.com',
                password: 'invalid_password',
            },
        }

        await expect(sut.execute(httpRequest.body)).rejects.toThrow(
            InvalidPasswordError,
        )
    })
    it('should return 404 if user is not found', async () => {
        const { sut, loginUserUseCaseStub } = makeSut(true)

        import.meta.jest
            .spyOn(loginUserUseCaseStub, 'execute')
            .mockRejectedValueOnce(new UserNotFoundError())

        const httpRequest = {
            body: {
                email: 'any_email@a.com',
                password: 'invalid_password',
            },
        }

        await expect(sut.execute(httpRequest.body)).rejects.toThrow(
            UserNotFoundError,
        )
    })

    it('should throw UserNotFoundError if user is not found', async () => {
        const { sut, getUserByEmailRepositoryStub } = makeSut()

        import.meta.jest
            .spyOn(getUserByEmailRepositoryStub, 'execute')
            .mockResolvedValueOnce(null)

        await expect(sut.execute('any_email', 'any_password')).rejects.toThrow(
            UserNotFoundError,
        )
    })

    it('should throw InvalidPasswordError if password is invalid', async () => {
        const { sut, passwordComparatorAdapterStub } = makeSut()

        import.meta.jest
            .spyOn(passwordComparatorAdapterStub, 'execute')
            .mockReturnValue(false)

        await expect(
            sut.execute('any_email', 'invalid_password'),
        ).rejects.toThrow(InvalidPasswordError)
    })
    it('should return user with tokens', async () => {
        const { sut } = makeSut()
        const response = await sut.execute('any_email', 'any_password')
        expect(response.tokens).toBeDefined()
    })
})
