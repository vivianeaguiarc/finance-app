import { app } from '../app.js'
import request from 'supertest'
import { user, transaction } from '../tests/fixtures/index.js'
import { faker } from '@faker-js/faker'

const createUser = async (email = faker.internet.email()) => {
    const res = await request(app)
        .post('/api/users')
        .send({
            ...user,
            id: undefined,
            email,
        })

    expect(res.status).toBe(201)
    return res.body
}

describe('Security E2E Tests', () => {
    it('POST /api/users should not return password in response', async () => {
        const createdUser = await createUser()

        expect(createdUser.password).toBeUndefined()
    })

    it('POST /api/users/login should not return password in response', async () => {
        const email = faker.internet.email()
        await createUser(email)

        const res = await request(app).post('/api/users/login').send({
            email,
            password: user.password,
        })

        expect(res.status).toBe(200)
        expect(res.body.password).toBeUndefined()
    })

    it('GET /api/users/me should not return password in response', async () => {
        const createdUser = await createUser()

        const res = await request(app)
            .get('/api/users/me')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)

        expect(res.status).toBe(200)
        expect(res.body.password).toBeUndefined()
    })

    it('DELETE /api/transactions/me/:id should return 403 for another user transaction', async () => {
        const owner = await createUser()
        const attacker = await createUser()

        const { body: createdTransaction } = await request(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${owner.tokens.accessToken}`)
            .send({
                ...transaction,
                user_id: owner.id,
                id: undefined,
            })

        const response = await request(app)
            .delete(`/api/transactions/me/${createdTransaction.id}`)
            .set('Authorization', `Bearer ${attacker.tokens.accessToken}`)

        expect(response.status).toBe(403)
    })

    it('DELETE /api/transactions/me/:id should return 404 for non-existent transaction', async () => {
        const createdUser = await createUser()

        const response = await request(app)
            .delete(`/api/transactions/me/${faker.string.uuid()}`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)

        expect(response.status).toBe(404)
    })
})
