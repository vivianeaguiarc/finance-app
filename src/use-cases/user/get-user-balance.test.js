import { faker } from '@faker-js/faker'
import { GetUserBalanceUseCase } from './get-user-balance.js'
import { userBalance, user } from '../../tests/fixtures/index.js'

describe('GetUserBalanceUseCase', () => {
    class GetUserBalanceRepositoryStub {
        async execute() {
            return userBalance
        }
    }
    class GetUserByIdRepositoryStub {
        async execute() {
            return user
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
    const from = '2023-01-01'
    const to = '2023-12-31'

    it('should successfully get user balance', async () => {
        const { sut } = makeSut()
        const result = await sut.execute(faker.string.uuid(), from, to)
        expect(result).toEqual(userBalance)
    })

    it('should throw UserNotFoundError if GetUserByIdRepository returns null', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockResolvedValueOnce(null)

        const userId = faker.string.uuid()
        const promise = sut.execute(userId, from, to)

        await expect(promise).rejects.toThrow(
            `User with id ${userId} not found.`,
        )
    })
    it('should call GetUserByIdRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdSpy = import.meta.jest.spyOn(
            getUserByIdRepository,
            'execute',
        )
        const userId = faker.string.uuid()
        await sut.execute(userId, from, to)
        expect(getUserByIdSpy).toHaveBeenCalledWith(userId)
    })
    it('should throw if GetUserBalanceRepository throws', async () => {
        const { sut, getUserBalanceRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserBalanceRepository, 'execute')
            .mockRejectedValueOnce(new Error())
        const promise = sut.execute(faker.string.uuid(), from, to)
        await expect(promise).rejects.toThrow()
    })
    it('should throw if GetUserByIdRepository throws', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockRejectedValueOnce(new Error())
        const promise = sut.execute(faker.string.uuid(), from, to)
        await expect(promise).rejects.toThrow()
    })
    it('should throw if GetUserBalanceRepository throws', async () => {
        const { sut, getUserBalanceRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserBalanceRepository, 'execute')
            .mockRejectedValueOnce(new Error())
        const promise = sut.execute(faker.string.uuid(), from, to)
        await expect(promise).rejects.toThrow()
    })
})
