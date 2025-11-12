import { faker } from '@faker-js/faker'
import { DeleteUserController } from './delete-user.js'
import { user } from '../../tests/fixtures/user.js'
import { UserNotFoundError } from '../../errors/index.js'

describe('Delete User Controller', () => {
    class DeleteUserUseCaseStub {
        async execute() {
            return user
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

        const result = await sut.execute(httpRequest)
        expect(result.statusCode).toBe(200)
    })
    it('shoult return 400 if id is invalid ', async () => {
        const { sut } = makeSut()
        const result = await sut.execute({
            params: { userId: 'invalid_id' },
        })
        expect(result.statusCode).toBe(400)
    })
    it('shoult return 404 if user is not found ', async () => {
        const { sut, deleteUserUseCase } = makeSut()
        import.meta.jest
            .spyOn(deleteUserUseCase, 'execute')
            .mockResolvedValueOnce(new UserNotFoundError())
        const result = await sut.execute(httpRequest)
        expect(result.statusCode).toBe(404)
    })
    it('shoult return 500 if DeleteUserUseCase throws', async () => {
        const { sut, deleteUserUseCase } = makeSut()
        import.meta.jest
            .spyOn(deleteUserUseCase, 'execute')
            .mockRejectedValueOnce(new Error())
        const result = await sut.execute(httpRequest)
        expect(result.statusCode).toBe(500)
    })
    it('shoult call DeleteUserUseCase with correct values', async () => {
        const { sut, deleteUserUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(deleteUserUseCase, 'execute')
        await sut.execute(httpRequest)
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId)
    })
})
