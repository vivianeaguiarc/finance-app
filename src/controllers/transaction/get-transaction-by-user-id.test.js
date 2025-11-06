import { faker } from '@faker-js/faker'
import { GetTransactionByUserIdController } from './get-transaction-by-user-id.js'
import { UserNotFoundError } from '../../errors/user.js'

describe('Get Transaction By User Id Controller', () => {
    class GetUserByIdUseCasesStub {
        async execute() {
            return {
                user_id: faker.string.uuid(),
                id: faker.string.uuid(),
                name: faker.commerce.productName(),
                date: faker.date.anytime().toDateString(),
                type: 'EXPENSE',
                amount: Number(faker.finance.amount()),
            }
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
            query: { userId: faker.string.uuid() },
        })
        expect(response.statusCode).toBe(200)
    })
    it('should return 400 when missing userId param', async () => {
        const { sut } = makeSut()
        const response = await sut.execute({
            query: { userId: undefined },
        })
        expect(response.statusCode).toBe(400)
    })
    it('should return 400 when userId is invalid', async () => {
        const { sut } = makeSut()
        const response = await sut.execute({
            query: { userId: 'invalid-id' },
        })
        expect(response.statusCode).toBe(400)
    })
    it('should return 404 when user is not found', async () => {
        const { sut, getUserByIdUseCase } = makeSut()
        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(),
        )
        const response = await sut.execute({
            query: { userId: faker.string.uuid() },
        })
        expect(response.statusCode).toBe(404)
    })
    it('should return 500 when GetUserByUseCase throws generic error', async () => {
        const { sut, getUserByIdUseCase } = makeSut()
        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )
        const response = await sut.execute({
            query: { userId: faker.string.uuid() },
        })
        expect(response.statusCode).toBe(500)
    })
    it('should call GetUserByIdUseCase with correct values', async () => {
        const { sut, getUserByIdUseCase } = makeSut()
        const executeSpy = jest.spyOn(getUserByIdUseCase, 'execute')
        const userId = faker.string.uuid()
        await sut.execute({ query: { userId: userId } })
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })
    it
})
