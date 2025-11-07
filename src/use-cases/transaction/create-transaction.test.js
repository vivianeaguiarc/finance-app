import { CreateTransactionUseCase } from './create-transaction.js'
import { UserNotFoundError } from '../../errors/user.js'
import { transaction, user } from '../../tests/fixtures/index.js'

describe('CreateTransactionUseCase', () => {
    const createTransactionParams = {
        ...transaction,
    }

    class CreateTransactionRepositoryStub {
        async execute(transaction) {
            return transaction
        }
    }

    class IdGeneratorAdapterStub {
        execute() {
            return 'random-id'
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
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
    it('should throw UserNotFoundError if user does not exist', async () => {
        const { sut, getUserByIdRepository, createTransactionParams } =
            makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)
        const promise = sut.execute(createTransactionParams)
        await expect(promise).rejects.toThrow(
            new UserNotFoundError(createTransactionParams.user_id),
        )
    })
    it('should throw if GetUserByIdRepository throws', async () => {
        const { sut, getUserByIdRepository, createTransactionParams } =
            makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )
        const promise = sut.execute(createTransactionParams)
        await expect(promise).rejects.toThrow()
    })
    it('should throw if IdGeneratorAdapter throws', async () => {
        const { sut, idGeneratorAdapter, createTransactionParams } = makeSut()
        jest.spyOn(idGeneratorAdapter, 'execute').mockImplementationOnce(() => {
            throw new Error()
        })
        const promise = sut.execute(createTransactionParams)
        await expect(promise).rejects.toThrow()
    })
    it('should throw if CreateTransactionRepository throws', async () => {
        const { sut, createTransactionRepository, createTransactionParams } =
            makeSut()
        jest.spyOn(
            createTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())
        const promise = sut.execute(createTransactionParams)
        await expect(promise).rejects.toThrow()
    })
})
