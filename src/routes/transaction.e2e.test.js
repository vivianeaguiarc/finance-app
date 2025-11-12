import { app } from '../app.cjs'
import request from 'supertest'
import { transaction, user } from '../tests/fixtures/index.js'
import { faker } from '@faker-js/faker'
import { TransactionType } from '@prisma/client'

describe(`Transaction Routes E2E Tests`, () => {
    it('POST /api/transactions should return 201 when transaction is created', async () => {
        // cria o usuário
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined })
        // cria a transação
        const response = await request(app)
            .post('/api/transactions')
            .send({ ...transaction, user_id: createdUser.id, id: undefined })
        expect(response.status).toBe(201)
        expect(response.body.user_id).toBe(createdUser.id)
        expect(response.body.amount).toBe(String(transaction.amount))
        expect(response.body.type).toBe(transaction.type)
    })
    it('GET /api/transaction?userId= should return 200 when transactions are found', async () => {
        // cria o usuário
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined })
        // cria a transação
        const { body: createdTransaction } = await request(app)
            .post('/api/transactions')
            .send({ ...transaction, user_id: createdUser.id, id: undefined })
        // busca as transações
        const response = await request(app).get(
            `/api/transactions?userId=${createdUser.id}`,
        )
        expect(response.status).toBe(200)
        expect(response.body).toEqual([createdTransaction])
    })
    it('PATCH /api/transactions/:transactionId should return 200 when transaction is updated', async () => {
        // cria o usuário
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined })
        // cria a transação
        const { body: createdTransaction } = await request(app)
            .post('/api/transactions')
            .send({ ...transaction, user_id: createdUser.id, id: undefined })

        const updateTransactionParams = {
            name: faker.commerce.productName(),
            amount: 2500,
            date: new Date().toISOString(),
            type: 'EARNING',
        }

        // atualiza
        const response = await request(app)
            .patch(`/api/transactions/${createdTransaction.id}`)
            .send(updateTransactionParams)

        expect(response.status).toBe(200)

        const updated = response.body
        expect(updated.amount).toBe(String(updateTransactionParams.amount))
        expect(updated.description).toBe(updateTransactionParams.description)
    })
    it('DELETE /api/transactions/:transactionId should return 200 when transaction is deleted', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined })
        // cria a transação
        const { body: createdTransaction } = await request(app)
            .post('/api/transactions')
            .send({ ...transaction, user_id: createdUser.id, id: undefined })
        const response = await request(app).delete(
            `/api/transactions/${createdTransaction.id}`,
        )
        expect(response.status).toBe(200)
    })
    it('PATCH /api/transactions/:transactionId should return 404 when transaction does not exist', async () => {
        const response = await request(app)
            .patch(`/api/transactions/${faker.string.uuid()}`)
            .send({ type: TransactionType.INVESTMENT })
        expect(response.status).toBe(404)
    })
    it('DELETE /api/transactions/:transactionId should return 404 when transaction does not exist', async () => {
        const response = await request(app).delete(
            `/api/transactions/${faker.string.uuid()}`,
        )
        expect(response.status).toBe(404)
    })
    it('GET /api/transactions?userId should return 404 when fetching transactions for a non-existing user', async () => {
        const response = await request(app).get(
            `/api/transactions?userId=${faker.string.uuid()}`,
        )
        expect(response.status).toBe(404)
    })
})
