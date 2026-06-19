import { app } from '../app.js'
import request from 'supertest'
import { user } from '../tests/fixtures/index.js'
import { faker } from '@faker-js/faker'
import { TransactionType } from '@prisma/client'
import { createUser } from './e2e-helpers.js'

describe('User Routes E2E Tests', () => {
    const from = '2023-01-01'
    const to = '2023-12-31'

    it('POST /api/users → should return 201 when user is created', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
                email: faker.internet.email(),
            })

        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)
        expect(res.body.data.tokens.accessToken).toBeDefined()
        expect(res.body.data.password).toBeUndefined()
    })

    it('GET /api/users/me → should return 200 when if user is authenticated', async () => {
        const createdUser = await createUser()

        const res = await request(app)
            .get(`/api/users/me`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)

        expect(res.status).toBe(200)
        expect(res.body.data.id).toBe(createdUser.id)
        expect(res.body.data.password).toBeUndefined()
    })

    it('PATCH /api/users/me → should update user and return 200', async () => {
        const createdUser = await createUser()

        const update = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        }

        const res = await request(app)
            .patch(`/api/users/me`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send(update)

        expect(res.status).toBe(200)
        expect(res.body.data.first_name).toBe(update.first_name)
        expect(res.body.data.last_name).toBe(update.last_name)
        expect(res.body.data.email).toBe(update.email)
        expect(res.body.data.password).toBeUndefined()
    })

    it('POST /api/users/login → should return 200 and tokens', async () => {
        const createdUser = await createUser()

        const res = await request(app).post('/api/users/login').send({
            email: createdUser.email,
            password: user.password,
        })

        expect(res.status).toBe(200)
        expect(res.body.data.tokens.accessToken).toBeDefined()
        expect(res.body.data.tokens.refreshToken).toBeDefined()
        expect(res.body.data.password).toBeUndefined()
    })

    it('DELETE /api/users/me → should return 204 when user is deleted', async () => {
        const createdUser = await createUser()

        const res = await request(app)
            .delete(`/api/users/me`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)

        expect(res.status).toBe(204)
        expect(res.body).toEqual({})
    })

    it('GET /api/users/me/balance → should return 200 and balance object', async () => {
        const createdUser = await createUser()

        const res = await request(app)
            .get(`/api/users/me/balance`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .query({ from, to })

        expect(res.status).toBe(200)
        expect(res.body.data).toHaveProperty('balance')
        expect(typeof Number(res.body.data.balance)).toBe('number')
    })

    it('GET /api/users/me/balance should return 200 and correct balance', async () => {
        const createRes = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
                email: faker.internet.email(),
            })

        const createdUser = createRes.body.data

        await request(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                user_id: createdUser.id,
                name: faker.commerce.productName(),
                date: new Date(from),
                type: TransactionType.EARNING,
                amount: 10000,
            })

        await request(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                user_id: createdUser.id,
                name: faker.commerce.productName(),
                date: new Date(from),
                type: TransactionType.EXPENSE,
                amount: 2000,
            })

        await request(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                user_id: createdUser.id,
                name: faker.commerce.productName(),
                date: new Date(to),
                type: TransactionType.INVESTMENT,
                amount: 2000,
            })

        const response = await request(app)
            .get(`/api/users/me/balance?from=${from}&to=${to}`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)

        expect(response.status).toBe(200)
        expect(response.body.data).toEqual({
            earnings: '10000',
            expenses: '2000',
            investments: '2000',
            balance: '6000',
            earningsPercentage: '71',
            expensesPercentage: '14',
            investmentsPercentage: '14',
        })
    })

    it('POST /api/users/refresh-token → should return 200 and new tokens', async () => {
        const createRes = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
                email: faker.internet.email(),
            })

        const createdUser = createRes.body.data

        const response = await request(app)
            .post('/api/users/refresh-token')
            .send({
                refreshToken: createdUser.tokens.refreshToken,
            })

        expect(response.status).toBe(200)
        expect(response.body.data.accessToken).toBeDefined()
        expect(response.body.data.refreshToken).toBeDefined()
    })
})
