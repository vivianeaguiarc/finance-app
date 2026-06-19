import { app } from '../app.js'
import request from 'supertest'
import { user } from '../tests/fixtures/index.js'
import { faker } from '@faker-js/faker'

export const createUser = async (email = faker.internet.email()) => {
    const res = await request(app)
        .post('/api/users')
        .send({
            ...user,
            id: undefined,
            email,
        })

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data.tokens).toBeDefined()

    return res.body.data
}
