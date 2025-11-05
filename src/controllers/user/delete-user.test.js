import { faker } from '@faker-js/faker'
import { DeleteUserController } from './delete-user.js'

describe('Delete User Controller', () => {
    class DeleteUserUseCaseStub {
        execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            }
        }
    }
    const makeSut = () => {
        const deleteUserUseCase = new DeleteUserUseCaseStub()
        const sut = new DeleteUserController(deleteUserUseCase)
        return {
            sut,
            deleteUserUseCase,
        }
    }
    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    }
    it('should return 200 when deleting a user successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.exceute(httpRequest)
        expect(result.statusCode).toBe(200)
    })
    it('shoult return 400 if id is invalid ', async () => {
        const { sut } = makeSut()
        const result = await sut.exceute({
            params: { userId: 'invalid_id' },
        })
        expect(result.statusCode).toBe(400)
    })
    it('shoult return 404 if user is not found ', async () => {
        const { sut, deleteUserUseCase } = makeSut()
        jest.spyOn(deleteUserUseCase, 'execute').mockReturnValueOnce(null)
        const result = await sut.exceute(httpRequest)
        expect(result.statusCode).toBe(404)
    })
})
