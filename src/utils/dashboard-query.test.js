import {
    buildDashboardSummary,
    buildDashboardWhere,
    resolveDashboardDateRange,
} from './dashboard-query.js'

describe('resolveDashboardDateRange', () => {
    it('returns explicit startDate and endDate', () => {
        expect(
            resolveDashboardDateRange({
                startDate: '2025-01-01T00:00:00.000Z',
                endDate: '2025-01-31T23:59:59.999Z',
            }),
        ).toEqual({
            startDate: '2025-01-01T00:00:00.000Z',
            endDate: '2025-01-31T23:59:59.999Z',
        })
    })

    it('builds month and year range', () => {
        const range = resolveDashboardDateRange({ month: 3, year: 2025 })

        expect(range.startDate).toBe('2025-03-01T00:00:00.000Z')
        expect(range.endDate).toBe('2025-03-31T23:59:59.999Z')
    })

    it('builds year-only range', () => {
        const range = resolveDashboardDateRange({ year: 2024 })

        expect(range.startDate).toBe('2024-01-01T00:00:00.000Z')
        expect(range.endDate).toBe('2024-12-31T23:59:59.999Z')
    })
})

describe('buildDashboardWhere', () => {
    it('always scopes by userId', () => {
        const where = buildDashboardWhere('user-1', {})

        expect(where.user_id).toBe('user-1')
    })

    it('applies categoryId as transaction name filter', () => {
        const where = buildDashboardWhere('user-1', { categoryId: 'Food' })

        expect(where.name).toBe('Food')
    })

    it('applies type and date filters', () => {
        const where = buildDashboardWhere('user-1', {
            type: 'EXPENSE',
            startDate: '2025-01-01T00:00:00.000Z',
            endDate: '2025-01-31T23:59:59.999Z',
        })

        expect(where.type).toBe('EXPENSE')
        expect(where.date.gte).toEqual(new Date('2025-01-01T00:00:00.000Z'))
        expect(where.date.lte).toEqual(new Date('2025-01-31T23:59:59.999Z'))
    })
})

describe('buildDashboardSummary', () => {
    it('calculates balance and averages from aggregates', () => {
        const summary = buildDashboardSummary({
            earningsSum: '1000.00',
            expensesSum: '300.00',
            investmentsSum: '200.00',
            totalCount: 4,
            maxEarning: '800.00',
            maxExpense: '150.00',
            avgEarning: '500.00',
            avgExpense: '150.00',
        })

        expect(summary).toEqual({
            totalEarnings: '1000.00',
            totalExpenses: '300.00',
            totalInvestments: '200.00',
            balance: '500.00',
            transactionCount: 4,
            highestEarning: '800.00',
            highestExpense: '150.00',
            averageEarning: '500.00',
            averageExpense: '150.00',
        })
    })

    it('returns zeroed summary when there are no transactions', () => {
        const summary = buildDashboardSummary({
            earningsSum: null,
            expensesSum: null,
            investmentsSum: null,
            totalCount: 0,
            maxEarning: null,
            maxExpense: null,
            avgEarning: null,
            avgExpense: null,
        })

        expect(summary.balance).toBe('0.00')
        expect(summary.transactionCount).toBe(0)
        expect(summary.totalEarnings).toBe('0.00')
    })
})
