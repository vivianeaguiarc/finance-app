import request from 'supertest'
import { app } from '../../app.js'
import {
    bearer,
    createAuthenticatedUser,
    useIntegrationTestHooks,
} from './helpers.js'

describe('Finance features integration', () => {
    useIntegrationTestHooks()

    it('POST /api/transactions/me/installments creates split expenses', async () => {
        const { accessToken } = await createAuthenticatedUser()

        const response = await request(app)
            .post('/api/transactions/me/installments')
            .set(bearer(accessToken))
            .send({
                name: 'Notebook',
                date: '2025-06-01T00:00:00.000Z',
                type: 'EXPENSE',
                totalAmount: 1200,
                totalInstallments: 12,
            })

        expect(response.status).toBe(201)
        expect(response.body.data.installments).toHaveLength(12)
        expect(response.body.data.installments[0].amount).toBe('100.00')
    })

    it('POST /api/transactions/me/installments rejects invalid installments', async () => {
        const { accessToken } = await createAuthenticatedUser()

        const response = await request(app)
            .post('/api/transactions/me/installments')
            .set(bearer(accessToken))
            .send({
                name: 'Notebook',
                date: '2025-06-01T00:00:00.000Z',
                type: 'EXPENSE',
                totalAmount: 1200,
                totalInstallments: 1,
            })

        expect(response.status).toBe(400)
    })

    it('POST /api/transactions/me/recurring creates recurring series', async () => {
        const { accessToken } = await createAuthenticatedUser()

        const response = await request(app)
            .post('/api/transactions/me/recurring')
            .set(bearer(accessToken))
            .send({
                name: 'Rent',
                date: '2025-06-01T00:00:00.000Z',
                type: 'EXPENSE',
                amount: 800,
                isRecurring: true,
                recurrenceType: 'MONTHLY',
                recurrenceEndDate: '2025-08-01T00:00:00.000Z',
            })

        expect(response.status).toBe(201)
        expect(response.body.data.totalOccurrences).toBeGreaterThan(1)
    })

    it('POST /api/transactions/me/recurring rejects invalid recurrenceType', async () => {
        const { accessToken } = await createAuthenticatedUser()

        const response = await request(app)
            .post('/api/transactions/me/recurring')
            .set(bearer(accessToken))
            .send({
                name: 'Rent',
                date: '2025-06-01T00:00:00.000Z',
                type: 'EXPENSE',
                amount: 800,
                isRecurring: true,
                recurrenceType: 'DAILY',
            })

        expect(response.status).toBe(400)
    })

    it('creates budget and returns safe/warning/exceeded alerts', async () => {
        const { accessToken } = await createAuthenticatedUser()

        const categoryResponse = await request(app)
            .post('/api/categories')
            .set(bearer(accessToken))
            .send({ name: 'Food' })

        const categoryId = categoryResponse.body.data.id

        await request(app).post('/api/budgets').set(bearer(accessToken)).send({
            categoryId,
            month: 6,
            year: 2025,
            limitAmount: 100,
        })

        await request(app)
            .post('/api/transactions/me')
            .set(bearer(accessToken))
            .send({
                name: 'Food',
                date: '2025-06-10T00:00:00.000Z',
                type: 'EXPENSE',
                amount: 90,
                categoryId,
            })

        const statusResponse = await request(app)
            .get('/api/budgets/status')
            .query({ month: 6, year: 2025 })
            .set(bearer(accessToken))

        expect(statusResponse.status).toBe(200)
        expect(statusResponse.body.data.alerts[0].status).toBe('warning')
    })

    it('prevents budget on category from another user', async () => {
        const userA = await createAuthenticatedUser()
        const userB = await createAuthenticatedUser()

        const categoryResponse = await request(app)
            .post('/api/categories')
            .set(bearer(userA.accessToken))
            .send({ name: 'Private' })

        const response = await request(app)
            .post('/api/budgets')
            .set(bearer(userB.accessToken))
            .send({
                categoryId: categoryResponse.body.data.id,
                month: 6,
                year: 2025,
                limitAmount: 100,
            })

        expect(response.status).toBe(403)
    })
})
