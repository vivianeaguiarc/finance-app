import { faker } from '@faker-js/faker'
import { UpdateTransactionController } from './update-transaction.js'
import { transaction } from '../../tests/fixtures/transaction.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'

describe('Get Transaction By User Id Controller', () => {
    class UpdateTransactionUseCasesStub {
        async execute() {
            return transaction
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
        import.meta.jest
            .spyOn(updateTransactionUseCase, 'execute')
            .mockImplementationOnce(() => {
                throw new Error()
            })
        const response = await sut.execute(baseHttpRequest)
        expect(response.statusCode).toBe(500)
    })
    it('should call UpdateTransactionUseCase with correct values', async () => {
        const { sut, updateTransactionUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            updateTransactionUseCase,
            'execute',
        )
        await sut.execute(baseHttpRequest)
        expect(executeSpy).toHaveBeenCalledWith(
            baseHttpRequest.params.transactionId,
            baseHttpRequest.body,
        )
    })
    it('should return 404 when TransactionNotFoundError is thrown', async () => {
        const { sut, updateTransactionUseCase } = makeSut()
        import.meta.jest
            .spyOn(updateTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new TransactionNotFoundError())
        const response = await sut.execute(baseHttpRequest)
        expect(response.statusCode).toBe(404)
    })
})
