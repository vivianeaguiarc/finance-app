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
        expect(result.body).not.toBeUndefined()
        expect(result.body).not.toBeNull()
    })
})
