import { CreateRecurringTransactionUseCase } from './create-recurring-transaction.js'
import { InvalidRecurrenceError } from '../../errors/transaction-finance.js'

describe('CreateRecurringTransactionUseCase', () => {
    it('creates recurring series with parent and children', async () => {
        const createManyTransactionsRepository = {
            execute: jest.fn().mockResolvedValue([
                { id: 'parent', is_recurring: true, amount: '100.00' },
                {
                    id: 'child',
                    parent_transaction_id: 'parent',
                    amount: '100.00',
                },
            ]),
        }

        const idGenerator = {
            execute: jest
                .fn()
                .mockReturnValueOnce('parent')
                .mockReturnValueOnce('child'),
        }

        const sut = new CreateRecurringTransactionUseCase(
            createManyTransactionsRepository,
            { execute: jest.fn().mockResolvedValue({ id: 'user-1' }) },
            { execute: jest.fn() },
            idGenerator,
            null,
        )

        const result = await sut.execute('user-1', {
            name: 'Salary',
            date: '2025-06-01T00:00:00.000Z',
            type: 'EARNING',
            amount: 100,
            isRecurring: true,
            recurrenceType: 'MONTHLY',
            recurrenceEndDate: '2025-07-01T00:00:00.000Z',
        })

        expect(result.totalOccurrences).toBe(2)
        expect(createManyTransactionsRepository.execute).toHaveBeenCalledTimes(
            1,
        )
    })

    it('rejects invalid recurrence period', async () => {
        const sut = new CreateRecurringTransactionUseCase(
            { execute: jest.fn() },
            { execute: jest.fn().mockResolvedValue({ id: 'user-1' }) },
            { execute: jest.fn() },
            { execute: jest.fn() },
            null,
        )

        await expect(
            sut.execute('user-1', {
                name: 'Salary',
                date: '2025-06-01T00:00:00.000Z',
                type: 'EARNING',
                amount: 100,
                isRecurring: true,
                recurrenceType: 'MONTHLY',
                recurrenceEndDate: '2025-01-01T00:00:00.000Z',
            }),
        ).rejects.toBeInstanceOf(InvalidRecurrenceError)
    })
})
