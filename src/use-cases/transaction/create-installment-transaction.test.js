import { CreateInstallmentTransactionUseCase } from './create-installment-transaction.js'
import { InvalidInstallmentError } from '../../errors/transaction-finance.js'
import { CategoryForbiddenError } from '../../errors/category.js'

describe('CreateInstallmentTransactionUseCase', () => {
    it('creates all installments atomically', async () => {
        const createManyTransactionsRepository = {
            execute: jest.fn().mockResolvedValue([
                { id: '1', installment_number: 1, amount: '100.00' },
                { id: '2', installment_number: 2, amount: '100.00' },
            ]),
        }

        const sut = new CreateInstallmentTransactionUseCase(
            createManyTransactionsRepository,
            { execute: jest.fn().mockResolvedValue({ id: 'user-1' }) },
            { execute: jest.fn() },
            { execute: jest.fn().mockReturnValue('group-id') },
            null,
        )

        const result = await sut.execute('user-1', {
            name: 'TV',
            date: '2025-06-01T00:00:00.000Z',
            type: 'EXPENSE',
            totalAmount: 200,
            totalInstallments: 2,
        })

        expect(result.installments).toHaveLength(2)
        expect(createManyTransactionsRepository.execute).toHaveBeenCalledTimes(
            1,
        )
    })

    it('rejects invalid installment count', async () => {
        const sut = new CreateInstallmentTransactionUseCase(
            { execute: jest.fn() },
            { execute: jest.fn().mockResolvedValue({ id: 'user-1' }) },
            { execute: jest.fn() },
            { execute: jest.fn() },
            null,
        )

        await expect(
            sut.execute('user-1', {
                name: 'TV',
                date: '2025-06-01T00:00:00.000Z',
                type: 'EXPENSE',
                totalAmount: 200,
                totalInstallments: 1,
            }),
        ).rejects.toBeInstanceOf(InvalidInstallmentError)
    })

    it('rejects category from another user', async () => {
        const sut = new CreateInstallmentTransactionUseCase(
            { execute: jest.fn() },
            { execute: jest.fn().mockResolvedValue({ id: 'user-1' }) },
            {
                execute: jest
                    .fn()
                    .mockResolvedValue({ id: 'cat-1', user_id: 'other-user' }),
            },
            { execute: jest.fn() },
            null,
        )

        await expect(
            sut.execute('user-1', {
                name: 'Food',
                date: '2025-06-01T00:00:00.000Z',
                type: 'EXPENSE',
                totalAmount: 200,
                totalInstallments: 2,
                categoryId: 'cat-1',
            }),
        ).rejects.toBeInstanceOf(CategoryForbiddenError)
    })
})
