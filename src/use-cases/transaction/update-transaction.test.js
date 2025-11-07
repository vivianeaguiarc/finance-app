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
})
