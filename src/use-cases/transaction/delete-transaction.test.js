import { faker } from '@faker-js/faker'
import { DeleteTransactionUseCase } from './delete-transaction.js'
import { transaction } from '../../tests/fixtures/index.js'
import { ForbiddenError } from '../../errors/index.js' // ← CORRETO

describe('DeleteTransactionUseCase', () => {
    const user_id = faker.string.uuid()

    class DeleteTransactionRepositoryStub {
        async execute(transactionId, userId) {
            return { ...transaction, user_id }
        }
    }

    class GetTransactionByIdRepositoryStub {
        async execute(transactionId, userId) {
            return { ...transaction, user_id }
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub()
        const getTransactionByIdRepository =
            new GetTransactionByIdRepositoryStub()

        const sut = new DeleteTransactionUseCase(
            deleteTransactionRepository,
            getTransactionByIdRepository,
        )

        return {
            sut,
            deleteTransactionRepository,
            getTransactionByIdRepository,
        }
    }

    it('should delete transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(transaction.id, user_id)

        expect(result).toEqual({ ...transaction, user_id })
    })

    it('should call DeleteTransactionRepository with correct params', async () => {
        const { sut, deleteTransactionRepository } = makeSut()

        const id = faker.string.uuid()
        const spy = import.meta.jest.spyOn(
            deleteTransactionRepository,
            'execute',
        )

        await sut.execute(id, user_id)

        expect(spy).toHaveBeenCalledWith(id, user_id)
    })

    it('should throw ForbiddenError if user does not own the transaction', async () => {
        const { sut, deleteTransactionRepository } = makeSut()

        import.meta.jest
            .spyOn(deleteTransactionRepository, 'execute')
            .mockResolvedValueOnce({ ...transaction, user_id: 'another-user' })

        await expect(sut.execute(transaction.id, user_id)).rejects.toThrow(
            ForbiddenError,
        )
    })

    it('should throw if DeleteTransactionRepository throws', async () => {
        const { sut, deleteTransactionRepository } = makeSut()

        import.meta.jest
            .spyOn(deleteTransactionRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        await expect(sut.execute(transaction.id, user_id)).rejects.toThrow()
    })

    it('should throw if GetTransactionByIdRepository throws', async () => {
        const { sut, getTransactionByIdRepository } = makeSut()

        import.meta.jest
            .spyOn(getTransactionByIdRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        await expect(sut.execute(transaction.id, user_id)).rejects.toThrow()
    })
})
