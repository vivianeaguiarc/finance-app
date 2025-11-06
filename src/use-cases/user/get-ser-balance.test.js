import { faker } from '@faker-js/faker'
import { GetUserBalanceUseCase } from './get-user-balance.js'

describe('GetUserBalanceUseCase', () => {
    const userBalance = {
        earnings: faker.finance.amount(),
        expenses: faker.finance.amount(),
        investments: faker.finance.amount(),
        balance: faker.finance.amount(),
    }
    class GetUserBalanceRepositoryStub {
        async execute() {
            return userBalance
        }
    }
    class GetUserByIdRepositoryStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            }
        }
    }
    const makeSut = () => {
        const getUserBalanceRepository = new GetUserBalanceRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetUserBalanceUseCase(
            getUserBalanceRepository,
            getUserByIdRepository,
        )
        return {
            sut,
            getUserBalanceRepository,
            getUserByIdRepository,
        }
    }
    it('should successfully get user balance', async () => {
        const { sut } = makeSut()
        const result = await sut.execute(faker.string.uuid())
        expect(result).toEqual(userBalance)
    })

    it('should throw UserNotFoundError if GetUserByIdRepository returns null', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)

        const userId = faker.string.uuid()
        const promise = sut.execute(userId)

        await expect(promise).rejects.toThrow(
            `User with id ${userId} not found.`,
        )
    })
})
