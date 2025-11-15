import { app } from '../app.js'
import request from 'supertest'
import { user } from '../tests/fixtures/index.js'
import { faker } from '@faker-js/faker'
// import { TransactionType } from '@prisma/client'

describe(`User Routes E2E Tests`, () => {
    it('POST/users should return 201 when user is created', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })
        expect(response.status).toBe(201)
    })
    it('GET /api/users/:userId should return 200 when user is found', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app).get(`/api/users/${createdUser.id}`)

        expect(response.status).toBe(200)
        expect(response.body).toEqual(createdUser)
    })
    it('PATCH /api/users/:userId should return 200 when user is updated', async () => {
        // cria o usuário
        const createRes = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined })

        const createdUser = createRes.body

        const updateUserParams = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        }

        // atualiza
        const response = await request(app)
            .patch(`/api/users/${createdUser.id}`)
            .send(updateUserParams)

        expect(response.status).toBe(200)

        const updated = response.body
        expect(updated.first_name).toBe(updateUserParams.first_name)
        expect(updated.last_name).toBe(updateUserParams.last_name)
        expect(updated.email).toBe(updateUserParams.email)

        // a maioria das APIs não retorna 'password' no body
        expect(updated).not.toBe('password')
    })

    it('GET /api/users/:userId should return 404 when user is not found', async () => {
        const response = await request(app).get(
            `/api/users/${faker.string.uuid()}`,
        )
        expect(response.status).toBe(404)
    })
    it('GET /api/users/:userId/balance should retiurn 404 when user is not found', async () => {
        const response = await request(app).get(
            `/api/users/${faker.string.uuid()}/balance`,
        )
        expect(response.status).toBe(404)
    })
    it('PATCH /api/users/:userId should return 404 when user is not found', async () => {
        const response = await request(app)
            .patch(`/api/users/${faker.string.uuid()}`)
            .send({
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
            })
        expect(response.status).toBe(404)
    })
    it('POST /api/users should return 400 when the provided email is already in use', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app)
            .post('/api/users')
            .send({
                ...user,
                email: createdUser.email,
                id: undefined,
            })

        expect(response.status).toBe(400)
    })
    it('PATCH /api/users/:userId should return 400 when the provided email is already in use', async () => {
        const { body: firstUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const { body: secondUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
                email: faker.internet.email(),
            })

        const response = await request(app)
            .patch(`/api/users/${secondUser.id}`)
            .send({
                email: firstUser.email,
            })

        expect(response.status).toBe(400)
    })
    it('POST /api/users/login should return 200 and tokens when user credentials are valid', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })
        const response = await request(app).post('/api/users/login').send({
            email: createdUser.email,
            password: user.password,
        })
        expect(response.status).toBe(200)
        expect(response.body.tokens.accessToken).toBeDefined()
        expect(response.body.tokens.accessToken).toBeDefined()
        expect(response.body.tokens.refreshToken).toBeDefined()
    })
})
