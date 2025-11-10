import request from 'supertest'
import { app } from '../../index.js'
import { user } from '../tests/fixtures/index.js'

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
})
