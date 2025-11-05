import { faker } from '@faker-js/faker'
import { UpdateTransactionController } from './update-transaction.js'

describe('Get Transaction By User Id Controller', () => {
    class UpdateTransactionUseCasesStub {
        async execute() {
            return {
                user_id: faker.string.uuid(),
                id: faker.string.uuid(),
                name: faker.commerce.productName(),
                date: faker.date.anytime().toISOString(),
                amount: Number(faker.finance.amount()),
                type: 'EXPENSE',
            }
        }
    }
    const makeSut = () => {
        const updateTransactionUseCase = new UpdateTransactionUseCasesStub()
        const sut = new UpdateTransactionController(updateTransactionUseCase)
        return { sut, updateTransactionUseCase }
    }
    const baseHttpRequest = {
        params: { transactionId: faker.string.uuid() },
        body: {
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            amount: Number(faker.finance.amount()),
            type: 'EXPENSE',
        },
    }

    it('should return 200 when updating a transaction successfully', async () => {
        const { sut } = makeSut()
        const response = await sut.execute(baseHttpRequest)
        expect(response.statusCode).toBe(200)
    })
    it('should return 400 when the id transaction id is invalid', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            ...baseHttpRequest,
            params: { transactionId: 'invalid-id' },
        }
        const response = await sut.execute(httpRequest)
        expect(response.statusCode).toBe(400)
    })
    it('should return 400 when unalloowed field is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            ...baseHttpRequest,
            body: {
                ...baseHttpRequest.body,
                unallowed_field: 'some value',
            },
        }
        const response = await sut.execute(httpRequest)
        expect(response.statusCode).toBe(400)
    })
    it('should return 400 when the amount is invalid', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            ...baseHttpRequest,
            body: {
                ...baseHttpRequest.body,
                amount: 'invalid-amount',
            },
        }
        const response = await sut.execute(httpRequest)
        expect(response.statusCode).toBe(400)
    })
    it('should return 400 when the type is invalid', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            ...baseHttpRequest,
            body: {
                ...baseHttpRequest.body,
                type: 'INVALID_TYPE',
            },
        }
        const response = await sut.execute(httpRequest)
        expect(response.statusCode).toBe(400)
    })
    it('should return 500 when the use case throws', async () => {
        const { sut, updateTransactionUseCase } = makeSut()
        jest.spyOn(updateTransactionUseCase, 'execute').mockImplementationOnce(
            () => {
                throw new Error()
            },
        )
        const response = await sut.execute(baseHttpRequest)
        expect(response.statusCode).toBe(500)
    })
})
