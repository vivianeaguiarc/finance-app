import { faker } from '@faker-js/faker'
import { UpdateTransactionUseCase } from './update-transaction'
import { transaction } from '../../tests/fixtures/index.js'

describe('Update Transaction Use Case', () => {
    class UpdateTransactionRepositoryStub {
        async execute() {
            return transaction
        }
    }
    const makeSut = () => {
        const updateTransactionRepositoryStub =
            new UpdateTransactionRepositoryStub()
        const sut = new UpdateTransactionUseCase(
            updateTransactionRepositoryStub,
        )
        return { sut, updateTransactionRepositoryStub }
    }
    it('should update a transaction successfully', async () => {
        const { sut } = makeSut()
        const id = faker.string.uuid()
        const result = await sut.execute(id, {
            amount: Number(faker.finance.amount()),
        })
        expect(result).toEqual({
            id,
            ...transaction,
        })
    })
    it('should call UpdateTransactionRepository with correct values', async () => {
        const { sut, updateTransactionRepositoryStub } = makeSut()
        const updateSpy = import.meta.jest.spyOn(
            updateTransactionRepositoryStub,
            'execute',
        )
        const id = faker.string.uuid()
        const updateData = {
            amount: Number(faker.finance.amount()),
        }
        await sut.execute(id, updateData)
        expect(updateSpy).toHaveBeenCalledWith(id, updateData)
    })
    it('should throw if UpdateTransactionRepository throws', async () => {
        const { sut, updateTransactionRepositoryStub } = makeSut()
        import.meta.jest
            .spyOn(updateTransactionRepositoryStub, 'execute')
            .mockImplementationOnce(() => {
                throw new Error('Repository error')
            })
        const id = faker.string.uuid()
        const updateData = {
            amount: Number(faker.finance.amount()),
        }
        await expect(sut.execute(id, updateData)).rejects.toThrow(
            'Repository error',
        )
    })
})
