import { faker } from '@faker-js/faker'
import { UpdateTransactionUseCase } from './update-transaction.js'
import { ForbiddenError } from '../../errors/user.js'

const makeSut = () => {
    const updateTransactionRepository = {
        execute: jest.fn(),
    }

    const getTransactionByIdRepository = {
        execute: jest.fn(),
    }

    const sut = new UpdateTransactionUseCase(
        updateTransactionRepository, // ✔ ORDEM CORRETA
        getTransactionByIdRepository, // ✔ ORDEM CORRETA
    )

    return {
        sut,
        updateTransactionRepository,
        getTransactionByIdRepository,
    }
}

describe('Update Transaction Use Case', () => {
    it('should update a transaction successfully', async () => {
        const {
            sut,
            updateTransactionRepository,
            getTransactionByIdRepository,
        } = makeSut()

        const id = faker.string.uuid()
        const existingTransaction = {
            id,
            user_id: 'user-123',
            amount: 100,
            name: 'Old name',
        }

        const updateData = {
            user_id: 'user-123',
            amount: 250,
            name: 'New name',
        }

        getTransactionByIdRepository.execute.mockResolvedValue(
            existingTransaction,
        )
        updateTransactionRepository.execute.mockResolvedValue({
            ...existingTransaction,
            ...updateData,
        })

        const result = await sut.execute(id, updateData)

        expect(result.amount).toBe(updateData.amount)
        expect(result.name).toBe(updateData.name)
    })

    it('should call UpdateTransactionRepository with correct values', async () => {
        const {
            sut,
            updateTransactionRepository,
            getTransactionByIdRepository,
        } = makeSut()

        const id = faker.string.uuid()

        const existingTransaction = {
            id,
            user_id: 'user-123',
        }

        const updateData = {
            user_id: 'user-123',
            amount: 500,
        }

        getTransactionByIdRepository.execute.mockResolvedValue(
            existingTransaction,
        )
        updateTransactionRepository.execute.mockResolvedValue(
            existingTransaction,
        )

        await sut.execute(id, updateData)

        expect(updateTransactionRepository.execute).toHaveBeenCalledWith(
            id,
            updateData,
        )
    })

    it('should throw if UpdateTransactionRepository throws', async () => {
        const {
            sut,
            updateTransactionRepository,
            getTransactionByIdRepository,
        } = makeSut()

        const id = faker.string.uuid()

        getTransactionByIdRepository.execute.mockResolvedValue({
            id,
            user_id: 'user-123',
        })

        updateTransactionRepository.execute.mockRejectedValue(
            new Error('Repository error'),
        )

        await expect(
            sut.execute(id, {
                user_id: 'user-123',
                amount: 100,
            }),
        ).rejects.toThrow('Repository error')
    })

    it('should throw ForbiddenError if user_id does not match', async () => {
        const { sut, getTransactionByIdRepository } = makeSut()

        getTransactionByIdRepository.execute.mockResolvedValue({
            id: 't-123',
            user_id: 'wrong-user',
        })

        await expect(
            sut.execute('t-123', {
                user_id: 'correct-user',
                amount: 999,
            }),
        ).rejects.toThrow(ForbiddenError)
    })
})
