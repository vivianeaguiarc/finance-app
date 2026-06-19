import request from 'supertest'
import { app } from '../../app.js'
import {
    bearer,
    createAuthenticatedUser,
    createTransaction,
    useIntegrationTestHooks,
} from './helpers.js'
import {
    CacheService,
    resetCacheServiceForTests,
} from '../../adapters/cache-service.js'
import { buildDashboardCacheKey } from '../../utils/cache-keys.js'
import { CreateTransactionUseCase } from '../../use-cases/transaction/create-transaction.js'

describe('Dashboard integration', () => {
    useIntegrationTestHooks()

    it('GET /api/dashboard should return empty dashboard when user has no transactions', async () => {
        const { accessToken } = await createAuthenticatedUser()

        const response = await request(app)
            .get('/api/dashboard')
            .set(bearer(accessToken))

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.data.summary).toEqual({
            totalEarnings: '0.00',
            totalExpenses: '0.00',
            totalInvestments: '0.00',
            balance: '0.00',
            transactionCount: 0,
            highestEarning: '0.00',
            highestExpense: '0.00',
            averageEarning: '0.00',
            averageExpense: '0.00',
        })
        expect(response.body.data.byCategory).toEqual([])
        expect(response.body.data.byMonth).toEqual([])
        expect(response.body.data.byType).toEqual([])
    })

    it('GET /api/dashboard should aggregate earnings and expenses', async () => {
        const { accessToken } = await createAuthenticatedUser()

        await createTransaction(accessToken, {
            name: 'Salary',
            type: 'EARNING',
            amount: 1000,
            date: '2025-06-01T00:00:00.000Z',
        })
        await createTransaction(accessToken, {
            name: 'Rent',
            type: 'EXPENSE',
            amount: 400,
            date: '2025-06-02T00:00:00.000Z',
        })

        const response = await request(app)
            .get('/api/dashboard')
            .set(bearer(accessToken))

        expect(response.status).toBe(200)
        expect(response.body.data.summary.totalEarnings).toBe('1000.00')
        expect(response.body.data.summary.totalExpenses).toBe('400.00')
        expect(response.body.data.summary.balance).toBe('600.00')
        expect(response.body.data.summary.transactionCount).toBe(2)
        expect(response.body.data.summary.highestEarning).toBe('1000.00')
        expect(response.body.data.summary.highestExpense).toBe('400.00')
        expect(response.body.data.byType).toHaveLength(2)
    })

    it('GET /api/dashboard should filter by period', async () => {
        const { accessToken } = await createAuthenticatedUser()

        await createTransaction(accessToken, {
            name: 'Old expense',
            type: 'EXPENSE',
            amount: 100,
            date: '2024-01-15T00:00:00.000Z',
        })
        await createTransaction(accessToken, {
            name: 'Current expense',
            type: 'EXPENSE',
            amount: 50,
            date: '2025-06-15T00:00:00.000Z',
        })

        const response = await request(app)
            .get('/api/dashboard')
            .query({
                startDate: '2025-06-01T00:00:00.000Z',
                endDate: '2025-06-30T23:59:59.999Z',
            })
            .set(bearer(accessToken))

        expect(response.status).toBe(200)
        expect(response.body.data.summary.totalExpenses).toBe('50.00')
        expect(response.body.data.summary.transactionCount).toBe(1)
    })

    it('GET /api/dashboard should filter by categoryId (transaction name)', async () => {
        const { accessToken } = await createAuthenticatedUser()

        await createTransaction(accessToken, {
            name: 'Food',
            type: 'EXPENSE',
            amount: 30,
            date: '2025-06-10T00:00:00.000Z',
        })
        await createTransaction(accessToken, {
            name: 'Transport',
            type: 'EXPENSE',
            amount: 20,
            date: '2025-06-11T00:00:00.000Z',
        })

        const response = await request(app)
            .get('/api/dashboard')
            .query({ categoryId: 'Food' })
            .set(bearer(accessToken))

        expect(response.status).toBe(200)
        expect(response.body.data.summary.totalExpenses).toBe('30.00')
        expect(response.body.data.summary.transactionCount).toBe(1)
        expect(response.body.data.byCategory[0].categoryName).toBe('Food')
    })

    it('GET /api/dashboard should isolate data per authenticated user', async () => {
        const userA = await createAuthenticatedUser()
        const userB = await createAuthenticatedUser()

        await createTransaction(userA.accessToken, {
            name: 'Salary',
            type: 'EARNING',
            amount: 500,
            date: '2025-06-01T00:00:00.000Z',
        })
        await createTransaction(userB.accessToken, {
            name: 'Bonus',
            type: 'EARNING',
            amount: 900,
            date: '2025-06-01T00:00:00.000Z',
        })

        const response = await request(app)
            .get('/api/dashboard')
            .set(bearer(userA.accessToken))

        expect(response.body.data.summary.totalEarnings).toBe('500.00')
        expect(response.body.data.summary.transactionCount).toBe(1)
    })

    it('GET /api/dashboard should require authentication', async () => {
        const response = await request(app).get('/api/dashboard')

        expect(response.status).toBe(401)
    })
})

describe('Dashboard cache', () => {
    afterEach(() => {
        resetCacheServiceForTests()
    })

    it('invalidates dashboard cache after transaction write', async () => {
        const cache = new CacheService({ redisUrl: null })
        await cache.init()

        const filters = { type: 'EXPENSE' }

        await cache.set(
            buildDashboardCacheKey('user-1', filters),
            { summary: { balance: '0.00' } },
            60,
            'user-1',
        )

        const createTransactionUseCase = new CreateTransactionUseCase(
            { execute: jest.fn().mockResolvedValue({ id: 'tx-1' }) },
            { execute: jest.fn().mockResolvedValue({ id: 'user-1' }) },
            { execute: jest.fn() },
            { execute: jest.fn().mockReturnValue('tx-id') },
            cache,
        )

        await createTransactionUseCase.execute({
            user_id: 'user-1',
            name: 'Food',
            type: 'EXPENSE',
            amount: 10,
            date: '2025-06-01T00:00:00.000Z',
        })

        expect(
            await cache.get(buildDashboardCacheKey('user-1', filters)),
        ).toBeNull()
    })
})
