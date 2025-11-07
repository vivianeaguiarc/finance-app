import { faker } from '@faker-js/faker'
import { UpdateTransactionUseCase } from './update-transaction'

describe('Update Transaction Use Case', () => {
    const transaction = {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        type: 'EXPENSE',
        amount: Number(faker.finance.amount()),
    }
    class UpdateTransactionRepositoryStub {
        async execute(transactionId) {
            return {
                id: transactionId,
                ...transaction,
            }
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
        const updateSpy = jest.spyOn(updateTransactionRepositoryStub, 'execute')
        const id = faker.string.uuid()
        const updateData = {
            amount: Number(faker.finance.amount()),
        }
        await sut.execute(id, updateData)
        expect(updateSpy).toHaveBeenCalledWith(id, updateData)
    })
    it('should throw if UpdateTransactionRepository throws', async () => {
        const { sut, updateTransactionRepositoryStub } = makeSut()
        jest.spyOn(
            updateTransactionRepositoryStub,
            'execute',
        ).mockImplementationOnce(() => {
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
