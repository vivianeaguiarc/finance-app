import { faker } from '@faker-js/faker'
import { GetTransactionByUserIdUseCase } from './get-transaction-by-user-id.js'
import { UserNotFoundError } from '../../errors/user.js'

describe('GetTransactionByUserIdUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
    }

    class GetTransactionByUserIdRepositoryStub {
        async execute() {
            return []
        }
    }
    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }
    const makeSut = () => {
        const getTransactionByUserIdRepository =
            new GetTransactionByUserIdRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetTransactionByUserIdUseCase(
            getTransactionByUserIdRepository,
            getUserByIdRepository,
        )
        return {
            sut,
            getTransactionByUserIdRepository,
            getUserByIdRepository,
        }
    }
    it('should get transactions by user id successfully', async () => {
        const { sut } = makeSut()
        const userId = faker.string.uuid()
        const result = await sut.execute(userId)
        expect(result).toEqual([])
    })
    it('should throw UserNotFoundError if user does not exist', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)
        const id = faker.string.uuid()
        const promise = sut.execute(id)
        await expect(promise).rejects.toThrow(new UserNotFoundError(id))
    })
    it('should call GetTransactionByUserIdRepository with correct param', async () => {
        const { sut, getTransactionByUserIdRepository } = makeSut()
        const userId = faker.string.uuid()
        const getByUserIdSpy = jest.spyOn(
            getTransactionByUserIdRepository,
            'execute',
        )
        await sut.execute(userId)
        expect(getByUserIdSpy).toHaveBeenCalledWith(userId)
    })
    it('should call GetTransactionByIdRepository with correct param', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        const userId = faker.string.uuid()
        const getByIdSpy = jest.spyOn(getUserByIdRepository, 'execute')
        await sut.execute(userId)
        expect(getByIdSpy).toHaveBeenCalledWith(userId)
    })
    it('shoult throw if GetTransactionByUserIdRepository throws', async () => {
        const { sut, getTransactionByUserIdRepository } = makeSut()
        jest.spyOn(
            getTransactionByUserIdRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())
        const promise = sut.execute(faker.string.uuid())
        await expect(promise).rejects.toThrow()
    })
})
