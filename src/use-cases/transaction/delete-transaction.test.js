import { faker } from '@faker-js/faker'
import { DeleteTransactionUseCase } from './delete-transaction.js'
import { transaction } from '../../tests/fixtures/index.js'

describe('DeleteTransactionUseCase', () => {
    class DeleteTransactionRepositoryStub {
        async execute() {
            return transaction
        }
    }
    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub()
        const sut = new DeleteTransactionUseCase(deleteTransactionRepository)
        return {
            sut,
            deleteTransactionRepository,
        }
    }
    it('should delete transaction successfully', async () => {
        const { sut } = makeSut()
        const result = await sut.execute(transaction.id)
        expect(result).toEqual(transaction)
    })
    it('should call DeleteTransactionRepository with correct id', async () => {
        const { sut, deleteTransactionRepository } = makeSut()
        const id = faker.string.uuid()
        const deleteSpy = import.meta.jest.spyOn(
            deleteTransactionRepository,
            'execute',
        )
        await sut.execute(id)
        expect(deleteSpy).toHaveBeenCalledWith(id)
    })
    it('should throw if DeleteTransactionRepository throws', async () => {
        const { sut, deleteTransactionRepository } = makeSut()
        import.meta.jest
            .spyOn(deleteTransactionRepository, 'execute')
            .mockRejectedValueOnce(new Error())
        const promise = sut.execute(faker.string.uuid())
        await expect(promise).rejects.toThrow()
    })
})
