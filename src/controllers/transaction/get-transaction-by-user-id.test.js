import { faker } from '@faker-js/faker'
import { GetTransactionByUserIdController } from './get-transaction-by-user-id.js'

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
})
