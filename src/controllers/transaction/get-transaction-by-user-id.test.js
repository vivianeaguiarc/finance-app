import { faker } from '@faker-js/faker'
import { GetTransactionByUserIdController } from './get-transaction-by-user-id.js'
import { UserNotFoundError } from '../../errors/user.js'
import { transaction } from '../../tests/fixtures/transaction.js'

describe('Get Transaction By User Id Controller', () => {
    const from = '2023-01-01T00:00:00.000Z'
    const to = '2023-12-31T23:59:59.999Z'
    class GetUserByIdUseCasesStub {
        async execute() {
            return transaction
        }
    }
    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCasesStub()
        const sut = new GetTransactionByUserIdController(getUserByIdUseCase)
        return { sut, getUserByIdUseCase }
    }
    it('should return 200 when finding transaction by user id successfully', async () => {
        const { sut } = makeSut()
        const response = await sut.execute({
            query: { userId: faker.string.uuid(), from, to },
        })
        expect(response.statusCode).toBe(200)
    })
    it('should return 400 when missing userId param', async () => {
        const { sut } = makeSut()
        const response = await sut.execute({
            query: { userId: undefined, from, to },
        })
        expect(response.statusCode).toBe(400)
    })
    it('should return 400 when userId is invalid', async () => {
        const { sut } = makeSut()
        const response = await sut.execute({
            query: { userId: 'invalid-id', from, to },
        })
        expect(response.statusCode).toBe(400)
    })
    it('should return 404 when user is not found', async () => {
        const { sut, getUserByIdUseCase } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdUseCase, 'execute')
            .mockRejectedValueOnce(new UserNotFoundError())
        const response = await sut.execute({
            query: { userId: faker.string.uuid(), from, to },
        })
        expect(response.statusCode).toBe(404)
    })
    it('should return 500 when GetUserByUseCase throws generic error', async () => {
        const { sut, getUserByIdUseCase } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdUseCase, 'execute')
            .mockRejectedValueOnce(new Error())
        const response = await sut.execute({
            query: { userId: faker.string.uuid(), from, to },
        })
        expect(response.statusCode).toBe(500)
    })
    it('should call GetUserByIdUseCase with correct values', async () => {
        const { sut, getUserByIdUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(getUserByIdUseCase, 'execute')
        const userId = faker.string.uuid()
        await sut.execute({ query: { userId: userId, from, to } })
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })
    it
})
