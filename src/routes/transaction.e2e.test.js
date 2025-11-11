import request from 'supertest'
import { app } from '../app.js'
import { transaction, user } from '../tests/fixtures/index.js'

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
            amount: 5000,
            description: 'Updated description',
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
})
