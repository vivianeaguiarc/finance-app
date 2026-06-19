import { app } from '../../app.js'
import request from 'supertest'
import { faker } from '@faker-js/faker'
import { user } from '../fixtures/index.js'
import {
    bearer,
    createAuthenticatedUser,
    createUser,
    loginUser,
    registerUser,
    useIntegrationTestHooks,
} from './helpers.js'

describe('Auth integration', () => {
    useIntegrationTestHooks()

    it('POST /api/users should register a new user', async () => {
        const response = await registerUser()

        expect(response.status).toBe(201)
        expect(response.body.success).toBe(true)
        expect(response.body.data.id).toBeDefined()
        expect(response.body.data.tokens.accessToken).toBeDefined()
        expect(response.body.data.tokens.refreshToken).toBeDefined()
        expect(response.body.data.password).toBeUndefined()
    })

    it('POST /api/users/login should authenticate with valid credentials', async () => {
        const createdUser = await createUser()

        const response = await loginUser(createdUser.email)

        expect(response.status).toBe(200)
        expect(response.body.data.tokens.accessToken).toBeDefined()
        expect(response.body.data.tokens.refreshToken).toBeDefined()
        expect(response.body.data.password).toBeUndefined()
    })

    it('POST /api/users/login should return 401 for invalid credentials', async () => {
        const createdUser = await createUser()

        const response = await loginUser(createdUser.email, 'wrong-password')

        expect(response.status).toBe(401)
        expect(response.body.success).toBe(false)
        expect(response.body.code).toBe('INVALID_CREDENTIALS')
    })

    it('POST /api/users/refresh-token should issue new tokens', async () => {
        const createdUser = await createUser()

        const response = await request(app)
            .post('/api/users/refresh-token')
            .send({ refreshToken: createdUser.tokens.refreshToken })

        expect(response.status).toBe(200)
        expect(response.body.data.accessToken).toBeDefined()
        expect(response.body.data.refreshToken).toBeDefined()
    })

    it('POST /api/users/refresh-token should return 401 for invalid token', async () => {
        const response = await request(app)
            .post('/api/users/refresh-token')
            .send({ refreshToken: 'invalid.refresh.token' })

        expect(response.status).toBe(401)
        expect(response.body.success).toBe(false)
    })

    it('GET /api/users/me should return 401 without token', async () => {
        const response = await request(app).get('/api/users/me')

        expect(response.status).toBe(401)
        expect(response.body.success).toBe(false)
        expect(response.body.code).toBe('UNAUTHORIZED')
    })

    it('GET /api/users/me should return 401 with invalid token', async () => {
        const response = await request(app)
            .get('/api/users/me')
            .set(bearer('invalid.token.value'))

        expect(response.status).toBe(401)
        expect(response.body.success).toBe(false)
    })

    it('GET /api/users/me should return 200 with valid token', async () => {
        const { accessToken, id } = await createAuthenticatedUser()

        const response = await request(app)
            .get('/api/users/me')
            .set(bearer(accessToken))

        expect(response.status).toBe(200)
        expect(response.body.data.id).toBe(id)
        expect(response.body.data.password).toBeUndefined()
    })

    it('PATCH /api/users/me should update the authenticated user', async () => {
        const { accessToken } = await createAuthenticatedUser()

        const update = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
        }

        const response = await request(app)
            .patch('/api/users/me')
            .set(bearer(accessToken))
            .send(update)

        expect(response.status).toBe(200)
        expect(response.body.data.first_name).toBe(update.first_name)
        expect(response.body.data.email).toBe(update.email)
        expect(response.body.data.password).toBeUndefined()
    })

    it('DELETE /api/users/me should delete the authenticated user', async () => {
        const { accessToken } = await createAuthenticatedUser()

        const response = await request(app)
            .delete('/api/users/me')
            .set(bearer(accessToken))

        expect(response.status).toBe(204)
    })
})
