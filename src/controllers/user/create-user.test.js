import { CreateUserController } from './create-user.js'

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        execute(user) {
            return user
        }
    }
    it('should return 201 when creating a user successfully', async () => {
        const createUserController = new CreateUserController()
        createUserController.createUserUseCase = new CreateUserUseCaseStub()
        const httpRequest = {
            body: {
                first_name: 'Viviane',
                last_name: 'Silva',
                email: 'viviane@zmail.com',
                password: 'secure1234',
            },
        }
        const result = await createUserController.execute(httpRequest)
        expect(result.statusCode).toBe(201)
        expect(result.body).toBe(httpRequest.body)
    })
    it('should return 400 if first_name is not provided', async () => {
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)
        const httpRequest = {
            body: {
                last_name: 'Silva',
                email: 'viviane@zmail.com',
                password: 'secure1234',
            },
        }
        const result = await createUserController.execute(httpRequest)
        expect(result.statusCode).toBe(400)
    })
    it('should return 400 if last_name is not provided', async () => {
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)
        const httpRequest = {
            body: {
                last_name: 'Aguiar',
                email: 'viviane@zmail.com',
                password: 'secure1234',
            },
        }
        const result = await createUserController.execute(httpRequest)
        expect(result.statusCode).toBe(400)
    })
})
