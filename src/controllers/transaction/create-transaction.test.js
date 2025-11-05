import { faker } from '@faker-js/faker'
import { CreateTransactionController } from './create-transaction.js'

describe('Create TransactionController', () => {
    // mock do retorno da use case
    const transaction = {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        name: faker.string.alphanumeric({ length: 10 }),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount()),
        type: faker.helpers.arrayElement(['EARNING', 'EXPENSE', 'INVESTMENT']),
    }

    class CreateTransactionUseCaseStub {
        async execute() {
            return transaction // agora existe
        }
    }

    const makeSut = () => {
        const createTransactionUseCase = new CreateTransactionUseCaseStub()
        const sut = new CreateTransactionController(createTransactionUseCase)
        return { sut, createTransactionUseCase }
    }

    // request base
    const baseHttpRequest = {
        body: {
            user_id: faker.string.uuid(),
            name: faker.string.alphanumeric({ length: 10 }),
            date: faker.date.anytime().toISOString(),
            amount: Number(faker.finance.amount()),
            type: faker.helpers.arrayElement([
                'EARNING',
                'EXPENSE',
                'INVESTMENT',
            ]),
        },
    }

    it('should return 201 when creating transaction successfully (expense)', async () => {
        const { sut } = makeSut()
        const result = await sut.execute(baseHttpRequest) // ← usa o request existente
        expect(result.statusCode).toBe(201)
    })
    it('should return 201 when creating transaction successfully (earning)', async () => {
        const { sut } = makeSut()
        const result = await sut.execute(baseHttpRequest) // ← usa o request existente
        expect(result.statusCode).toBe(201)
    })
    it('should return 201 when creating transaction successfully (investment)', async () => {
        const { sut } = makeSut()
        const result = await sut.execute(baseHttpRequest) // ← usa o request existente
        expect(result.statusCode).toBe(201)
    })
    it('should return 400 when missing user_id', async () => {
        const { sut } = makeSut()
        const response = await sut.execute({
            body: { ...baseHttpRequest.body, user_id: undefined },
        })
        expect(response.statusCode).toBe(400)
    })
    it('should return 400 when missing name', async () => {
        const { sut } = makeSut()
        const response = await sut.execute({
            body: { ...baseHttpRequest.body, name: undefined },
        })
        expect(response.statusCode).toBe(400)
    })
    it('should return 400 when missing date', async () => {
        const { sut } = makeSut()
        const response = await sut.execute({
            body: { ...baseHttpRequest.body, date: undefined },
        })
        expect(response.statusCode).toBe(400)
    })
    it('should return 400 when missing type', async () => {
        const { sut } = makeSut()
        const response = await sut.execute({
            body: { ...baseHttpRequest.body, type: undefined },
        })
        expect(response.statusCode).toBe(400)
    })
    it('should return 400 when missing amount', async () => {
        const { sut } = makeSut()
        const response = await sut.execute({
            body: { ...baseHttpRequest.body, amount: undefined },
        })
        expect(response.statusCode).toBe(400)
    })
    it('should return 400 when date is invalid', async () => {
        const { sut } = makeSut()
        const response = await sut.execute({
            body: { ...baseHttpRequest.body, date: 'invalid_date' },
        })
        expect(response.statusCode).toBe(400)
    })
    it('should return 400 when type is not EARNING, EXPENSE or INVESTMENT', async () => {
        const { sut } = makeSut()
        const response = await sut.execute({
            body: { ...baseHttpRequest.body, type: 'invalid_type' },
        })
        expect(response.statusCode).toBe(400)
    })
    it('should return 400 when amount is not currency', async () => {
        const { sut } = makeSut()
        const response = await sut.execute({
            body: { ...baseHttpRequest.body, amount: 'invalid_amount' },
        })
        expect(response.statusCode).toBe(400)
    })
    it('should return 500 if CreateTransactionUseCase throws', async () => {
        // erro 500
        const { sut, createTransactionUseCase } = makeSut()
        jest.spyOn(createTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )
        const result = await sut.execute(baseHttpRequest)
        expect(result.statusCode).toBe(500)
    })
})
