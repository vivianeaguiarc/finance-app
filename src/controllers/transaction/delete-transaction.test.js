import { TransactionNotFoundError } from '../../errors/transaction.js'
import { transaction } from '../../tests/fixtures/index.js'
import { DeleteTransactionController } from './delete-transaction.js'

import { faker } from '@faker-js/faker'

describe('Delete Transaction Controller', () => {
    class DeleteTransactionUseCasesStub {
        async execute() {
            return transaction
        }
    }
    const makeSut = () => {
        const deleteTransactionUseCase = new DeleteTransactionUseCasesStub()
        const sut = new DeleteTransactionController(deleteTransactionUseCase)
        return { sut, deleteTransactionUseCase }
    }
    it('should return 200 when transaction is successfully deleted', async () => {
        const { sut } = makeSut()
        const response = await sut.execute({
            params: { transactionId: faker.string.uuid() },
        })
        expect(response.statusCode).toBe(200)
    })
    it('should return 400 when id is invalid', async () => {
        const { sut } = makeSut()
        const response = await sut.execute({
            params: { transactionId: 'invalid-id' },
        })
        expect(response.statusCode).toBe(400)
    })
    it('should return 404 when transaction is not found', async () => {
        const { sut, deleteTransactionUseCase } = makeSut()
        jest.spyOn(deleteTransactionUseCase, 'execute').mockRejectedValueOnce(
            new TransactionNotFoundError(faker.string.uuid()),
        )
        const response = await sut.execute({
            params: { transactionId: faker.string.uuid() },
        })
        expect(response.statusCode).toBe(404)
    })
    it('should return 500 when use case throws', async () => {
        const { sut, deleteTransactionUseCase } = makeSut()
        jest.spyOn(deleteTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )
        const response = await sut.execute({
            params: { transactionId: faker.string.uuid() },
        })
        expect(response.statusCode).toBe(500)
    })
    it('should call DeleteTransactionUseCase with correct values', async () => {
        const { sut, deleteTransactionUseCase } = makeSut()
        const executeSpy = jest.spyOn(deleteTransactionUseCase, 'execute')
        const transactionId = faker.string.uuid()
        await sut.execute({ params: { transactionId } })
        expect(executeSpy).toHaveBeenCalledWith(transactionId)
    })
})
