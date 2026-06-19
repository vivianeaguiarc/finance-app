import request from 'supertest'
import { faker } from '@faker-js/faker'
import { app } from '../../app.js'
import { transaction, user } from '../fixtures/index.js'

export const bearer = (accessToken) => ({
    Authorization: `Bearer ${accessToken}`,
})

export const registerUser = async (email = faker.internet.email()) => {
    const response = await request(app)
        .post('/api/users')
        .send({
            ...user,
            id: undefined,
            email,
        })

    return response
}

export const createUser = async (email = faker.internet.email()) => {
    const response = await registerUser(email)

    expect(response.status).toBe(201)
    expect(response.body.success).toBe(true)
    expect(response.body.data.tokens).toBeDefined()
    expect(response.body.data.password).toBeUndefined()

    return response.body.data
}

export const loginUser = async (email, password = user.password) => {
    return request(app).post('/api/users/login').send({ email, password })
}

export const createAuthenticatedUser = async () => {
    const createdUser = await createUser()

    return {
        ...createdUser,
        accessToken: createdUser.tokens.accessToken,
        refreshToken: createdUser.tokens.refreshToken,
    }
}

export const createTransaction = async (accessToken, overrides = {}) => {
    const response = await request(app)
        .post('/api/transactions/me')
        .set(bearer(accessToken))
        .send({
            ...transaction,
            id: undefined,
            ...overrides,
        })

    expect(response.status).toBe(201)

    return response.body.data
}

export const findTransactionById = (listResponse, transactionId) =>
    listResponse.body.data.find((item) => item.id === transactionId)

export const useIntegrationTestHooks = () => {
    beforeAll(async () => {
        const { ensureDatabaseReady, resetDatabase } = await import(
            './database.js'
        )
        await ensureDatabaseReady()
        await resetDatabase()
    })

    afterEach(async () => {
        const { resetDatabase } = await import('./database.js')
        await resetDatabase()
    })

    afterAll(async () => {
        const { disconnectDatabase } = await import('./database.js')
        await disconnectDatabase()
    })
}
