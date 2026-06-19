import { faker } from '@faker-js/faker'
import { listTransactionsQuerySchema } from './transaction.js'

describe('listTransactionsQuerySchema', () => {
    const userId = faker.string.uuid()

    it('should apply default pagination', () => {
        const result = listTransactionsQuerySchema.parse({ userId })

        expect(result.page).toBe(1)
        expect(result.limit).toBe(10)
        expect(result.sortBy).toBe('date')
        expect(result.sortOrder).toBe('desc')
    })

    it('should reject limit above maximum', () => {
        const result = listTransactionsQuerySchema.safeParse({
            userId,
            limit: 101,
        })

        expect(result.success).toBe(false)
    })

    it('should accept date range filters', () => {
        const result = listTransactionsQuerySchema.parse({
            userId,
            startDate: '2024-01-01T00:00:00.000Z',
            endDate: '2024-12-31T23:59:59.999Z',
        })

        expect(result.startDate).toBe('2024-01-01T00:00:00.000Z')
        expect(result.endDate).toBe('2024-12-31T23:59:59.999Z')
    })

    it('should map legacy from/to to startDate/endDate', () => {
        const result = listTransactionsQuerySchema.parse({
            userId,
            from: '2024-01-01',
            to: '2024-12-31',
        })

        expect(result.startDate).toBe('2024-01-01')
        expect(result.endDate).toBe('2024-12-31')
    })

    it('should accept type filter', () => {
        const result = listTransactionsQuerySchema.parse({
            userId,
            type: 'EXPENSE',
        })

        expect(result.type).toBe('EXPENSE')
    })

    it('should accept valid sort fields', () => {
        const result = listTransactionsQuerySchema.parse({
            userId,
            sortBy: 'amount',
            sortOrder: 'asc',
        })

        expect(result.sortBy).toBe('amount')
        expect(result.sortOrder).toBe('asc')
    })

    it('should reject invalid sortBy', () => {
        const result = listTransactionsQuerySchema.safeParse({
            userId,
            sortBy: 'name',
        })

        expect(result.success).toBe(false)
    })

    it('should reject invalid sortOrder', () => {
        const result = listTransactionsQuerySchema.safeParse({
            userId,
            sortOrder: 'invalid',
        })

        expect(result.success).toBe(false)
    })

    it('should reject unallowed query parameters', () => {
        const result = listTransactionsQuerySchema.safeParse({
            userId,
            categoryId: faker.string.uuid(),
        })

        expect(result.success).toBe(false)
    })

    it('should reject minAmount greater than maxAmount', () => {
        const result = listTransactionsQuerySchema.safeParse({
            userId,
            minAmount: 500,
            maxAmount: 100,
        })

        expect(result.success).toBe(false)
    })
})
