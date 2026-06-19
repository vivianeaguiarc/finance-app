import { app } from '../../app.js'
import request from 'supertest'
import { TransactionType } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { transaction } from '../fixtures/index.js'
import {
    bearer,
    createAuthenticatedUser,
    createTransaction,
    createUser,
    findTransactionById,
    useIntegrationTestHooks,
} from './helpers.js'

describe('Transactions integration', () => {
    useIntegrationTestHooks()

    const from = '2023-01-01T00:00:00.000Z'
    const to = '2023-12-31T23:59:59.999Z'

    it('POST /api/transactions/me should create a transaction for the authenticated user', async () => {
        const { accessToken, id: userId } = await createAuthenticatedUser()

        const response = await request(app)
            .post('/api/transactions/me')
            .set(bearer(accessToken))
            .send({
                ...transaction,
                id: undefined,
            })

        expect(response.status).toBe(201)
        expect(response.body.data.user_id).toBe(userId)
        expect(response.body.data.type).toBe(transaction.type)
    })

    it('POST /api/transactions/me should ignore user_id sent in body and use token owner', async () => {
        const owner = await createAuthenticatedUser()
        const otherUser = await createUser()

        const response = await request(app)
            .post('/api/transactions/me')
            .set(bearer(owner.accessToken))
            .send({
                ...transaction,
                user_id: otherUser.id,
                id: undefined,
            })

        expect(response.status).toBe(201)
        expect(response.body.data.user_id).toBe(owner.id)
        expect(response.body.data.user_id).not.toBe(otherUser.id)
    })

    it('POST /api/transactions/me should return 400 for invalid body', async () => {
        const { accessToken } = await createAuthenticatedUser()

        const response = await request(app)
            .post('/api/transactions/me')
            .set(bearer(accessToken))
            .send({
                name: '',
                amount: -10,
                type: 'INVALID',
                date: 'not-a-date',
            })

        expect(response.status).toBe(400)
        expect(response.body.success).toBe(false)
        expect(response.body.code).toBe('VALIDATION_ERROR')
    })

    it('GET /api/transactions/me should list only authenticated user transactions', async () => {
        const owner = await createAuthenticatedUser()
        const otherUser = await createAuthenticatedUser()

        const created = await createTransaction(owner.accessToken, {
            date: new Date(from),
        })

        await createTransaction(otherUser.accessToken)

        const response = await request(app)
            .get('/api/transactions/me')
            .set(bearer(owner.accessToken))
            .query({ from, to })

        expect(response.status).toBe(200)
        expect(response.body.data).toHaveLength(1)
        expect(response.body.data[0].id).toBe(created.id)
        expect(response.body.meta.total).toBe(1)
    })

    it('GET /api/transactions/me should find a transaction by id in the paginated list', async () => {
        const { accessToken } = await createAuthenticatedUser()
        const created = await createTransaction(accessToken, {
            date: new Date(from),
        })

        const response = await request(app)
            .get('/api/transactions/me')
            .set(bearer(accessToken))

        const found = findTransactionById(response, created.id)

        expect(response.status).toBe(200)
        expect(found).toBeDefined()
        expect(found.name).toBe(created.name)
        expect(found.amount).toBe(created.amount)
    })

    it('PATCH /api/transactions/me/:id should update own transaction', async () => {
        const { accessToken } = await createAuthenticatedUser()
        const created = await createTransaction(accessToken)

        const updatePayload = {
            name: faker.commerce.productName(),
            amount: 3000,
            type: 'EARNING',
            date: new Date().toISOString(),
        }

        const response = await request(app)
            .patch(`/api/transactions/me/${created.id}`)
            .set(bearer(accessToken))
            .send(updatePayload)

        expect(response.status).toBe(200)
        expect(response.body.data.name).toBe(updatePayload.name)
        expect(response.body.data.amount).toBe(String(updatePayload.amount))
        expect(response.body.data.type).toBe(updatePayload.type)
    })

    it('PATCH /api/transactions/me/:id should return 403 for another user transaction', async () => {
        const owner = await createAuthenticatedUser()
        const attacker = await createAuthenticatedUser()
        const created = await createTransaction(owner.accessToken)

        const response = await request(app)
            .patch(`/api/transactions/me/${created.id}`)
            .set(bearer(attacker.accessToken))
            .send({ name: 'Hacked' })

        expect(response.status).toBe(403)
        expect(response.body.code).toBe('FORBIDDEN')
    })

    it('DELETE /api/transactions/me/:id should delete own transaction', async () => {
        const { accessToken } = await createAuthenticatedUser()
        const created = await createTransaction(accessToken)

        const response = await request(app)
            .delete(`/api/transactions/me/${created.id}`)
            .set(bearer(accessToken))

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)

        const listResponse = await request(app)
            .get('/api/transactions/me')
            .set(bearer(accessToken))

        expect(listResponse.body.data).toHaveLength(0)
        expect(listResponse.body.meta.total).toBe(0)
    })

    it('DELETE /api/transactions/me/:id should return 403 for another user transaction', async () => {
        const owner = await createAuthenticatedUser()
        const attacker = await createAuthenticatedUser()
        const created = await createTransaction(owner.accessToken)

        const response = await request(app)
            .delete(`/api/transactions/me/${created.id}`)
            .set(bearer(attacker.accessToken))

        expect(response.status).toBe(403)
        expect(response.body.code).toBe('FORBIDDEN')
    })

    it('DELETE /api/transactions/me/:id should return 404 for non-existent transaction', async () => {
        const { accessToken } = await createAuthenticatedUser()

        const response = await request(app)
            .delete(`/api/transactions/me/${faker.string.uuid()}`)
            .set(bearer(accessToken))

        expect(response.status).toBe(404)
        expect(response.body.code).toBe('TRANSACTION_NOT_FOUND')
    })

    it('GET /api/transactions/me should apply default pagination', async () => {
        const { accessToken } = await createAuthenticatedUser()

        const response = await request(app)
            .get('/api/transactions/me')
            .set(bearer(accessToken))

        expect(response.status).toBe(200)
        expect(response.body.meta).toEqual({
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
        })
    })

    it('GET /api/transactions/me should reject limit above maximum', async () => {
        const { accessToken } = await createAuthenticatedUser()

        const response = await request(app)
            .get('/api/transactions/me')
            .set(bearer(accessToken))
            .query({ limit: 101 })

        expect(response.status).toBe(400)
        expect(response.body.code).toBe('VALIDATION_ERROR')
    })

    it('GET /api/transactions/me should filter by type and date range', async () => {
        const { accessToken } = await createAuthenticatedUser()

        await createTransaction(accessToken, {
            type: 'EXPENSE',
            date: new Date(from),
        })

        await createTransaction(accessToken, {
            name: 'Salary',
            type: 'EARNING',
            date: new Date(from),
        })

        const response = await request(app)
            .get('/api/transactions/me')
            .set(bearer(accessToken))
            .query({
                type: 'EXPENSE',
                startDate: from,
                endDate: to,
            })

        expect(response.status).toBe(200)
        expect(response.body.data).toHaveLength(1)
        expect(response.body.data[0].type).toBe('EXPENSE')
    })

    it('GET /api/transactions/me should reject unsupported categoryId filter', async () => {
        const { accessToken } = await createAuthenticatedUser()

        const response = await request(app)
            .get('/api/transactions/me')
            .set(bearer(accessToken))
            .query({ categoryId: faker.string.uuid() })

        expect(response.status).toBe(400)
        expect(response.body.code).toBe('VALIDATION_ERROR')
    })

    it('GET /api/transactions/me should accept valid sort params', async () => {
        const { accessToken } = await createAuthenticatedUser()

        const response = await request(app)
            .get('/api/transactions/me')
            .set(bearer(accessToken))
            .query({ sortBy: 'amount', sortOrder: 'asc' })

        expect(response.status).toBe(200)
    })

    it('GET /api/transactions/me should reject invalid sortBy', async () => {
        const { accessToken } = await createAuthenticatedUser()

        const response = await request(app)
            .get('/api/transactions/me')
            .set(bearer(accessToken))
            .query({ sortBy: 'name' })

        expect(response.status).toBe(400)
        expect(response.body.code).toBe('VALIDATION_ERROR')
    })

    it('GET /api/users/me/balance should return correct balance for period', async () => {
        const { accessToken } = await createAuthenticatedUser()
        const balanceFrom = '2023-01-01'
        const balanceTo = '2023-12-31'

        await request(app)
            .post('/api/transactions/me')
            .set(bearer(accessToken))
            .send({
                name: faker.commerce.productName(),
                date: new Date(balanceFrom),
                type: TransactionType.EARNING,
                amount: 10000,
            })

        await request(app)
            .post('/api/transactions/me')
            .set(bearer(accessToken))
            .send({
                name: faker.commerce.productName(),
                date: new Date(balanceFrom),
                type: TransactionType.EXPENSE,
                amount: 2000,
            })

        await request(app)
            .post('/api/transactions/me')
            .set(bearer(accessToken))
            .send({
                name: faker.commerce.productName(),
                date: new Date(balanceTo),
                type: TransactionType.INVESTMENT,
                amount: 2000,
            })

        const response = await request(app)
            .get('/api/users/me/balance')
            .set(bearer(accessToken))
            .query({ from: balanceFrom, to: balanceTo })

        expect(response.status).toBe(200)
        expect(response.body.data).toEqual({
            earnings: '10000',
            expenses: '2000',
            investments: '2000',
            balance: '6000',
            earningsPercentage: '71',
            expensesPercentage: '14',
            investmentsPercentage: '14',
        })
    })
})
