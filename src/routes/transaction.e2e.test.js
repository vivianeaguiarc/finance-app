import { app } from '../app.js'
import request from 'supertest'
import { transaction, user } from '../tests/fixtures/index.js'
import { faker } from '@faker-js/faker'
import { createUser } from './e2e-helpers.js'

describe('Transaction Routes E2E Tests (com /me)', () => {
    const from = '2023-01-01T00:00:00.000Z'
    const to = '2023-12-31T23:59:59.999Z'

    const createUserAndLogin = async () => {
        const createdUser = await createUser()
        return {
            user: createdUser,
            token: createdUser.tokens.accessToken,
        }
    }

    it('POST /api/transactions/me → should create transaction (201)', async () => {
        const { user: createdUser, token } = await createUserAndLogin()

        const response = await request(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${token}`)
            .send({
                ...transaction,
                id: undefined,
            })

        expect(response.status).toBe(201)
        expect(response.body.data.user_id).toBe(createdUser.id)
        expect(response.body.data.amount).toBe(String(transaction.amount))
        expect(response.body.data.type).toBe(transaction.type)
    })

    it('GET /api/transactions/me → should return only user transactions (200)', async () => {
        const { token } = await createUserAndLogin()

        const createResponse = await request(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${token}`)
            .send({
                ...transaction,
                date: new Date(from),
                id: undefined,
            })

        const createdTransaction = createResponse.body.data

        const response = await request(app)
            .get(`/api/transactions/me`)
            .set('Authorization', `Bearer ${token}`)
            .query({ from, to })

        expect(response.status).toBe(200)
        expect(Array.isArray(response.body.data)).toBe(true)
        expect(response.body.data.length).toBeGreaterThan(0)
        expect(response.body.data[0].id).toBe(createdTransaction.id)
    })

    it('PATCH /api/transactions/me/:id → should update (200)', async () => {
        const { token } = await createUserAndLogin()

        const createResponse = await request(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${token}`)
            .send({
                ...transaction,
                id: undefined,
            })

        const createdTransaction = createResponse.body.data

        const updatePayload = {
            name: faker.commerce.productName(),
            amount: 3000,
            type: 'EARNING',
            date: new Date().toISOString(),
        }

        const response = await request(app)
            .patch(`/api/transactions/me/${createdTransaction.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatePayload)

        expect(response.status).toBe(200)
        expect(response.body.data.amount).toBe(String(updatePayload.amount))
        expect(response.body.data.name).toBe(updatePayload.name)
        expect(response.body.data.type).toBe(updatePayload.type)
    })

    it('DELETE /api/transactions/me/:id → should return 200', async () => {
        const { token } = await createUserAndLogin()

        const createResponse = await request(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${token}`)
            .send({ ...transaction, id: undefined })

        const createdTransaction = createResponse.body.data

        const response = await request(app)
            .delete(`/api/transactions/me/${createdTransaction.id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
    })

    it('GET /api/transactions (sem /me) → should return 200 list', async () => {
        const { token } = await createUserAndLogin()

        await request(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${token}`)
            .send({ ...transaction, id: undefined })

        const response = await request(app)
            .get('/api/transactions')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(Array.isArray(response.body.data)).toBe(true)
        expect(response.body.data.length).toBeGreaterThan(0)
    })
})
