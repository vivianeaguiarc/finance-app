import { app } from '../app.js'
import request from 'supertest'
import { user, transaction } from '../tests/fixtures/index.js'
import { faker } from '@faker-js/faker'

import { createUser } from './e2e-helpers.js'

describe('Security E2E Tests', () => {
    it('POST /api/users should not return password in response', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
                email: faker.internet.email(),
            })

        expect(res.body.data?.password).toBeUndefined()
    })

    it('POST /api/users/login should not return password in response', async () => {
        const email = faker.internet.email()
        await createUser(email)

        const res = await request(app).post('/api/users/login').send({
            email,
            password: user.password,
        })

        expect(res.status).toBe(200)
        expect(res.body.data?.password).toBeUndefined()
    })

    it('GET /api/users/me should not return password in response', async () => {
        const createdUser = await createUser()

        const res = await request(app)
            .get('/api/users/me')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)

        expect(res.status).toBe(200)
        expect(res.body.data?.password).toBeUndefined()
    })

    it('DELETE /api/transactions/me/:id should return 403 for another user transaction', async () => {
        const owner = await createUser()
        const attacker = await createUser()

        const createRes = await request(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${owner.tokens.accessToken}`)
            .send({
                ...transaction,
                user_id: owner.id,
                id: undefined,
            })

        const createdTransaction = createRes.body.data

        const response = await request(app)
            .delete(`/api/transactions/me/${createdTransaction.id}`)
            .set('Authorization', `Bearer ${attacker.tokens.accessToken}`)

        expect(response.status).toBe(403)
        expect(response.body.success).toBe(false)
        expect(response.body.code).toBe('FORBIDDEN')
    })

    it('DELETE /api/transactions/me/:id should return 404 for non-existent transaction', async () => {
        const createdUser = await createUser()

        const response = await request(app)
            .delete(`/api/transactions/me/${faker.string.uuid()}`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)

        expect(response.status).toBe(404)
        expect(response.body.success).toBe(false)
        expect(response.body.code).toBe('TRANSACTION_NOT_FOUND')
    })
})
