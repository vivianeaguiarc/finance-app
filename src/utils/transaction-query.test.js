import { faker } from '@faker-js/faker'
import {
    buildPaginationMeta,
    buildTransactionOrderBy,
    buildTransactionWhere,
} from './transaction-query.js'

describe('transaction-query utils', () => {
    const userId = faker.string.uuid()

    it('should build where clause with ownership and filters', () => {
        const where = buildTransactionWhere(userId, {
            type: 'EXPENSE',
            startDate: '2024-01-01T00:00:00.000Z',
            endDate: '2024-12-31T23:59:59.999Z',
            minAmount: 10,
            maxAmount: 1000,
        })

        expect(where.user_id).toBe(userId)
        expect(where.type).toBe('EXPENSE')
        expect(where.date.gte).toEqual(new Date('2024-01-01T00:00:00.000Z'))
        expect(where.date.lte).toEqual(new Date('2024-12-31T23:59:59.999Z'))
        expect(where.amount.gte.toString()).toBe('10')
        expect(where.amount.lte.toString()).toBe('1000')
    })

    it('should map allowed sort fields', () => {
        expect(buildTransactionOrderBy('createdAt', 'desc')).toEqual({
            created_at: 'desc',
        })
        expect(buildTransactionOrderBy('amount', 'asc')).toEqual({
            amount: 'asc',
        })
    })

    it('should build pagination meta', () => {
        expect(buildPaginationMeta(1, 10, 25)).toEqual({
            page: 1,
            limit: 10,
            total: 25,
            totalPages: 3,
        })

        expect(buildPaginationMeta(1, 10, 0)).toEqual({
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
        })
    })
})
