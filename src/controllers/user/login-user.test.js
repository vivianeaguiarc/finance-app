import { LoginUserController } from './login-user.js'
import { user } from '../../tests/fixtures/user.js'
import { InvalidPasswordError, UserNotFoundError } from '../../errors/index.js'

describe('LoginUserController', () => {
    const httpRequest = {
        body: {
            email: 'any_email@mail.com',
            password: 'any_password',
        },
    }
    class LoginUserUseCaseStub {
        async execute(email, password) {
            // Simula retorno do caso de uso: usuário + tokens
            return {
                ...user,
                tokens: {
                    accessToken: 'any_access-token',
                    refreshToken: 'any_refresh-token',
                },
            }
        }
    }

    const makeSut = () => {
        const loginUserUseCase = new LoginUserUseCaseStub()
        const sut = new LoginUserController(loginUserUseCase)
        return { sut, loginUserUseCase }
    }

    it('should return 200 with user and tokens', async () => {
        const { sut } = makeSut()

        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(200)

        // garante que veio um usuário (ex: do fixture)
        expect(response.body).toHaveProperty('id')

        // garante que os tokens existem e têm os valores esperados
        expect(response.body).toHaveProperty('tokens')
        expect(response.body.tokens).toHaveProperty(
            'accessToken',
            'any_access-token',
        )
        expect(response.body.tokens).toHaveProperty(
            'refreshToken',
            'any_refresh-token',
        )
    })
    it('should return 401 if password is invalid', async () => {
        const { sut, loginUserUseCase } = makeSut()
        import.meta.jest
            .spyOn(loginUserUseCase, 'execute')
            .mockRejectedValueOnce(new InvalidPasswordError())
        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                password: 'any_password',
            },
        }
        const response = await sut.execute(httpRequest)
        expect(response.statusCode).toBe(401)
    })
    it('should return 404 if user is not found', async () => {
        const { sut, loginUserUseCase } = makeSut()
        import.meta.jest
            .spyOn(loginUserUseCase, 'execute')
            .mockRejectedValueOnce(new UserNotFoundError())
        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                password: 'any_password',
            },
        }
        const response = await sut.execute(httpRequest)
        expect(response.statusCode).toBe(404)
    })
})
