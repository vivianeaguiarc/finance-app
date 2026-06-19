import request from 'supertest'
import { app } from '../../app.js'
import {
    bearer,
    createAuthenticatedUser,
    createTransaction,
    useIntegrationTestHooks,
} from './helpers.js'

describe('Financial reports integration', () => {
    useIntegrationTestHooks()

    it('GET /api/reports/financial returns JSON report', async () => {
        const { accessToken } = await createAuthenticatedUser()

        await createTransaction(accessToken, {
            name: 'Salary',
            type: 'EARNING',
            amount: 1000,
            date: '2025-06-10T00:00:00.000Z',
        })
        await createTransaction(accessToken, {
            name: 'Food',
            type: 'EXPENSE',
            amount: 200,
            date: '2025-06-12T00:00:00.000Z',
        })

        const response = await request(app)
            .get('/api/reports/financial')
            .query({
                startDate: '2025-06-01T00:00:00.000Z',
                endDate: '2025-06-30T23:59:59.999Z',
            })
            .set(bearer(accessToken))

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.data.summary.totalEarnings).toBe('1000.00')
        expect(response.body.data.summary.totalExpenses).toBe('200.00')
        expect(response.body.data.summary.balance).toBe('800.00')
        expect(response.body.data.transactions).toHaveLength(2)
        expect(response.body.data.byType).toHaveLength(2)
        expect(response.body.data.byCategory.length).toBeGreaterThan(0)
        expect(JSON.stringify(response.body)).not.toMatch(/password/i)
        expect(JSON.stringify(response.body)).not.toMatch(/user_id/)
        expect(JSON.stringify(response.body)).not.toMatch(/token_hash/)
    })

    it('GET /api/reports/financial?format=csv returns CSV with headers', async () => {
        const { accessToken } = await createAuthenticatedUser()

        await createTransaction(accessToken, {
            name: 'Food',
            type: 'EXPENSE',
            amount: 50,
            date: '2025-06-05T00:00:00.000Z',
        })

        const response = await request(app)
            .get('/api/reports/financial')
            .query({ format: 'csv', month: 6, year: 2025 })
            .set(bearer(accessToken))

        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/text\/csv/)
        expect(response.text).toContain('Financial Report')
        expect(response.text).toContain('Date,Name,Type,Amount,Category')
        expect(response.text).toContain('Summary By Category')
        expect(response.text).toContain('Summary By Type')
        expect(response.text).not.toContain('user_id')
        expect(response.text).not.toContain('password')
    })

    it('GET /api/reports/financial?format=pdf returns application/pdf', async () => {
        const { accessToken } = await createAuthenticatedUser()

        await createTransaction(accessToken, {
            name: 'Food',
            type: 'EXPENSE',
            amount: 30,
            date: '2025-06-05T00:00:00.000Z',
        })

        const response = await request(app)
            .get('/api/reports/financial')
            .query({ format: 'pdf', month: 6, year: 2025 })
            .set(bearer(accessToken))
            .buffer()
            .parse((res, callback) => {
                const data = []
                res.on('data', (chunk) => data.push(chunk))
                res.on('end', () => callback(null, Buffer.concat(data)))
            })

        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toBe('application/pdf')
        expect(response.body.slice(0, 4).toString()).toBe('%PDF')
    })

    it('GET /api/reports/financial filters by period', async () => {
        const { accessToken } = await createAuthenticatedUser()

        await createTransaction(accessToken, {
            name: 'June',
            type: 'EXPENSE',
            amount: 100,
            date: '2025-06-15T00:00:00.000Z',
        })
        await createTransaction(accessToken, {
            name: 'July',
            type: 'EXPENSE',
            amount: 999,
            date: '2025-07-15T00:00:00.000Z',
        })

        const response = await request(app)
            .get('/api/reports/financial')
            .query({ month: 6, year: 2025 })
            .set(bearer(accessToken))

        expect(response.status).toBe(200)
        expect(response.body.data.summary.totalExpenses).toBe('100.00')
        expect(response.body.data.transactions).toHaveLength(1)
        expect(response.body.data.transactions[0].name).toBe('June')
    })

    it('GET /api/reports/financial filters by categoryId', async () => {
        const { accessToken } = await createAuthenticatedUser()

        const category = await request(app)
            .post('/api/categories')
            .set(bearer(accessToken))
            .send({ name: 'Food' })

        await createTransaction(accessToken, {
            name: 'Lunch',
            type: 'EXPENSE',
            amount: 40,
            date: '2025-06-10T00:00:00.000Z',
            categoryId: category.body.data.id,
        })
        await createTransaction(accessToken, {
            name: 'Transport',
            type: 'EXPENSE',
            amount: 20,
            date: '2025-06-11T00:00:00.000Z',
        })

        const response = await request(app)
            .get('/api/reports/financial')
            .query({
                month: 6,
                year: 2025,
                categoryId: category.body.data.id,
            })
            .set(bearer(accessToken))

        expect(response.status).toBe(200)
        expect(response.body.data.transactions).toHaveLength(1)
        expect(response.body.data.transactions[0].categoryName).toBe('Food')
    })

    it('GET /api/reports/financial rejects invalid format', async () => {
        const { accessToken } = await createAuthenticatedUser()

        const response = await request(app)
            .get('/api/reports/financial')
            .query({ format: 'xml' })
            .set(bearer(accessToken))

        expect(response.status).toBe(400)
        expect(response.body.code).toBe('VALIDATION_ERROR')
    })

    it('GET /api/reports/financial isolates data per user', async () => {
        const userA = await createAuthenticatedUser()
        const userB = await createAuthenticatedUser()

        await createTransaction(userA.accessToken, {
            name: 'Private',
            type: 'EARNING',
            amount: 500,
            date: '2025-06-01T00:00:00.000Z',
        })

        const response = await request(app)
            .get('/api/reports/financial')
            .query({ month: 6, year: 2025 })
            .set(bearer(userB.accessToken))

        expect(response.status).toBe(200)
        expect(response.body.data.summary.totalEarnings).toBe('0.00')
        expect(response.body.data.transactions).toHaveLength(0)
    })

    it('GET /api/reports/financial requires authentication', async () => {
        const response = await request(app).get('/api/reports/financial')

        expect(response.status).toBe(401)
    })
})
