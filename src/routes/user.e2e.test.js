import { app } from '../app.js'
import request from 'supertest'
import { user } from '../tests/fixtures/index.js'
import { faker } from '@faker-js/faker'

// Helper para criar usuário único em cada teste
const createUser = async () => {
    const uniqueUser = {
        ...user,
        id: undefined,
        email: faker.internet.email(), // garante e-mail único
    }

    const res = await request(app).post('/api/users').send(uniqueUser)

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body).toHaveProperty('tokens')

    return res.body
}

describe('User Routes E2E Tests', () => {
    const from = '2023-01-01'
    const to = '2023-12-31'

    // -----------------------------------------------------------------------------
    it('POST /api/users → should return 201 when user is created', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
                email: faker.internet.email(),
            })

        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('tokens.accessToken')
    })

    // -----------------------------------------------------------------------------
    it('GET /api/users → should return 200 when user is found', async () => {
        const createdUser = await createUser()

        const res = await request(app)
            .get(`/api/users`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)

        expect(res.status).toBe(200)
        expect(res.body.id).toBe(createdUser.id)
    })

    // -----------------------------------------------------------------------------
    it('PATCH /api/users → should update user and return 200', async () => {
        const createdUser = await createUser()

        const update = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        }

        const res = await request(app)
            .patch(`/api/users`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send(update)

        expect(res.status).toBe(200)
        expect(res.body.first_name).toBe(update.first_name)
        expect(res.body.last_name).toBe(update.last_name)
        expect(res.body.email).toBe(update.email)
        expect(res.body.password).toBeUndefined()
    })

    // -----------------------------------------------------------------------------
    it('POST /api/users/login → should return 200 and tokens', async () => {
        const createdUser = await createUser()

        const res = await request(app).post('/api/users/login').send({
            email: createdUser.email,
            password: user.password,
        })

        expect(res.status).toBe(200)
        expect(res.body.tokens.accessToken).toBeDefined()
        expect(res.body.tokens.refreshToken).toBeDefined()
    })

    // -----------------------------------------------------------------------------
    it('DELETE /api/users → should return 204 when user is deleted', async () => {
        const createdUser = await createUser()

        const res = await request(app)
            .delete(`/api/users`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)

        expect(res.status).toBe(204)
        expect(res.body).toEqual({})
    })

    // -----------------------------------------------------------------------------
    it('GET /api/users/balance → should return 200 and balance object', async () => {
        const createdUser = await createUser()

        const res = await request(app)
            .get(`/api/users/balance`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .query({ from, to }) //  <<<<<<<<<< OBRIGATÓRIO AGORA

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('balance')
        expect(typeof Number(res.body.balance)).toBe('number')
    })

    // -----------------------------------------------------------------------------
    it('POST /api/users/refresh-token → should return 200 and new tokens', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
                email: faker.internet.email(),
            })

        const response = await request(app)
            .post('/api/users/refresh-token')
            .send({
                refreshToken: createdUser.tokens.refreshToken,
            })

        expect(response.status).toBe(200)
        expect(response.body.accessToken).toBeDefined()
        expect(response.body.refreshToken).toBeDefined()
    })
})
