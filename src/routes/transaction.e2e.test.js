import { app } from '../app.js'
import request from 'supertest'
import { transaction, user } from '../tests/fixtures/index.js'
import { faker } from '@faker-js/faker'

/**
 * E2E – Testes completos do fluxo de Transações
 * -------------------------------------------------
 * Cada teste:
 *  1. Cria um usuário
 *  2. Faz login para obter token
 *  3. Usa o token nas rotas protegidas /transactions
 */
describe('Transaction Routes E2E Tests (Organizado)', () => {
    const from = '2023-01-01T00:00:00.000Z'
    const to = '2023-12-31T23:59:59.999Z'

    const createAndLogin = async () => {
        // 1. Criar usuário
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined })

        // 2. Login com as mesmas credenciais
        const loginRes = await request(app).post('/api/users/login').send({
            email: user.email,
            password: user.password,
        })

        return {
            user: createdUser,
            token: loginRes.body.tokens.accessToken,
        }
    }

    /**
     * 1) Criar transação
     */
    it('POST /api/transactions → should return 201 when created', async () => {
        const { user: createdUser, token } = await createAndLogin()

        const response = await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${token}`) // rota protegida
            .send({
                ...transaction,
                id: undefined,
            })

        expect(response.status).toBe(201)
        expect(response.body.user_id).toBe(createdUser.id)
        expect(response.body.amount).toBe(String(transaction.amount))
        expect(response.body.type).toBe(transaction.type)
    })
    it('GET /api/transaction?userId should return 200 when fetching transactions successfully', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined })

        const { body: createdTransaction } = await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send({ ...transaction, id: undefined, user_id: createdUser.id })

        const response = await request(app)
            .get(`/api/transactions?from=${from}&to=${to}`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .query({ userId: createdUser.id })

        expect(response.status).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
        expect(response.body.length).toBeGreaterThan(0)
        expect(response.body[0].id).toBe(createdTransaction.id)
    })

    /**
     * 2) Buscar transações do usuário autenticado
     */
    it('GET /api/transactions → should return 200 and a list', async () => {
        const { token } = await createAndLogin()

        // cria uma transação antes da busca
        await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${token}`)
            .send({ ...transaction, id: undefined })

        // busca todas
        const response = await request(app)
            .get('/api/transactions')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
        expect(response.body.length).toBeGreaterThan(0)
    })

    /**
     * 3) Atualizar transação existente
     */
    it('PATCH /api/transactions/:id → should update and return 200', async () => {
        const { token } = await createAndLogin()

        // cria transação inicial
        const { body: createdTransaction } = await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${token}`)
            .send({ ...transaction, id: undefined })

        const updatePayload = {
            name: faker.commerce.productName(),
            amount: 3000,
            type: 'EARNING',
            date: new Date().toISOString(),
        }

        // atualiza transação
        const response = await request(app)
            .patch(`/api/transactions/${createdTransaction.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatePayload)

        expect(response.status).toBe(200)
        expect(response.body.amount).toBe(String(updatePayload.amount))
        expect(response.body.name).toBe(updatePayload.name)
        expect(response.body.type).toBe(updatePayload.type)
    })

    /**
     * 4) Deletar transação pelo ID
     */
    it('DELETE /api/transactions/:id → should return 200', async () => {
        const { token } = await createAndLogin()

        // cria transação para deletar
        const { body: createdTransaction } = await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${token}`)
            .send({ ...transaction, id: undefined })

        const response = await request(app)
            .delete(`/api/transactions/${createdTransaction.id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
    })
})
