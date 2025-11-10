import request from 'supertest'
import { app } from '../app.js'
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
    // it('DELETE /api/users/:userId should return 200 when user is deleted', async () => {
    //     const { body: createdUser } = await request(app)
    //         .post('/api/users')
    //         .send({
    //             ...user,
    //             id: undefined,
    //         })
    //     await request(app).post('/api/transactions').send({
    //         user_id: createdUser.id,
    //         name: faker.commerce.productName(),
    //         date: faker.date.anytime().toISOString(),
    //         type: 'EARNING',
    //         amount: 10000,
    //     })
    //      await request(app).post('/api/transactions').send({
    //          user_id: createdUser.id,
    //          name: faker.commerce.productName(),
    //          date: faker.date.anytime().toISOString(),
    //          type: 'EXPENSE',
    //          amount: 2000,
    //      })
    //          await request(app).post('/api/transactions').send({
    //              user_id: createdUser.id,
    //              name: faker.commerce.productName(),
    //              date: faker.date.anytime().toISOString(),
    //              type: 'INVESTMENT',
    //              amount: 2000,
    //          })

    //     const response = await request(app).get(
    //         `/api/users/${createdUser.id}/balance`
    //     )

    //     expect(response.status).toBe(200)
    //     expect(response.body).toEqual({
    //         earnings: '10000',
    //         expenses: '2000',
    //         investments: '2000',
    //         balance: '6000',
    //     })
    // })
})
