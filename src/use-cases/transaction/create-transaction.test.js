import { faker } from '@faker-js/faker'
import { CreateTransactionUseCase } from './create-transaction.js'

describe('CreateTransactionUseCase', () => {
    const createTransactionParams = {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        type: 'EXPENSE',
        amount: Number(faker.finance.amount()),
    }

    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
    }

    class CreateTransactionRepositoryStub {
        async execute(transaction) {
            return transaction
        }
    }

    class IdGeneratorAdapterStub {
        execute() {
            // ✅ use case chama execute()
            return 'random-id'
        }
    }

    class GetUserByIdRepositoryStub {
        async execute(userId) {
            return { ...user, id: userId }
        }
    }

    const makeSut = () => {
        const createTransactionRepository =
            new CreateTransactionRepositoryStub()
        const idGeneratorAdapter = new IdGeneratorAdapterStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new CreateTransactionUseCase(
            createTransactionRepository,
            getUserByIdRepository,
            idGeneratorAdapter,
        )

        return {
            sut,
            createTransactionRepository,
            idGeneratorAdapter,
            getUserByIdRepository,
            user,
            createTransactionParams,
        }
    }

    it('should create transaction successfully', async () => {
        const { sut, createTransactionParams } = makeSut()
        const result = await sut.execute(createTransactionParams)
        expect(result).toEqual({ ...createTransactionParams, id: 'random-id' })
    })
    it('should call GetUserByIdRepository with correct user id', async () => {
        const { sut, getUserByIdRepository, createTransactionParams } =
            makeSut()
        const getUserByIdSpy = jest.spyOn(getUserByIdRepository, 'execute')
        await sut.execute(createTransactionParams)
        expect(getUserByIdSpy).toHaveBeenCalledWith(
            createTransactionParams.user_id,
        )
    })
    it('should call id IdGeneratorAdapter to generate transaction id', async () => {
        const { sut, idGeneratorAdapter, createTransactionParams } = makeSut()
        const generateIdSpy = jest.spyOn(idGeneratorAdapter, 'execute')
        await sut.execute(createTransactionParams)
        expect(generateIdSpy).toHaveBeenCalled()
    })
    it('should call CreateTransactionRepository with correct values', async () => {
        const { sut, createTransactionRepository, createTransactionParams } =
            makeSut()
        const createTransactionSpy = jest.spyOn(
            createTransactionRepository,
            'execute',
        )
        await sut.execute(createTransactionParams)
        expect(createTransactionSpy).toHaveBeenCalledWith({
            ...createTransactionParams,
            id: 'random-id',
        })
    })
})
