import { DeleteTransactionController } from './delete-transaction'
import { faker } from '@faker-js/faker'

describe('Delete Transaction Controller', () => {
    class DeleteTransactionUseCasesStub {
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
})
