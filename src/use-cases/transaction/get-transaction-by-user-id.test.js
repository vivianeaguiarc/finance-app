import { faker } from '@faker-js/faker'
import { GetTransactionByUserIdUseCase } from './get-transaction-by-user-id.js'
import { UserNotFoundError } from '../../errors/user.js'
import { user } from '../../tests/fixtures/index.js'

describe('GetTransactionByUserIdUseCase', () => {
    const defaultQuery = {
        page: 1,
        limit: 10,
        sortBy: 'date',
        sortOrder: 'desc',
    }

    class GetTransactionByUserIdRepositoryStub {
        async execute() {
            return { items: [], total: 0 }
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
        const result = await sut.execute(userId, defaultQuery)
        expect(result).toEqual({ items: [], total: 0 })
    })
    it('should throw UserNotFoundError if user does not exist', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockResolvedValueOnce(null)
        const id = faker.string.uuid()
        const promise = sut.execute(id, defaultQuery)
        await expect(promise).rejects.toThrow(UserNotFoundError)
    })

    it('should call GetTransactionByUserIdRepository with correct params', async () => {
        const { sut, getTransactionByUserIdRepository } = makeSut()

        const userId = faker.string.uuid()

        const getByUserIdSpy = import.meta.jest.spyOn(
            getTransactionByUserIdRepository,
            'execute',
        )

        await sut.execute(userId, defaultQuery)

        expect(getByUserIdSpy).toHaveBeenCalledWith(userId, defaultQuery)
    })

    it('shoult throw if GetTransactionByUserIdRepository throws', async () => {
        const { sut, getTransactionByUserIdRepository } = makeSut()
        import.meta.jest
            .spyOn(getTransactionByUserIdRepository, 'execute')
            .mockRejectedValueOnce(new Error())
        const promise = sut.execute(faker.string.uuid(), defaultQuery)
        await expect(promise).rejects.toThrow()
    })
})
