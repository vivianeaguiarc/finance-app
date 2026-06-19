import request from 'supertest'
import { app } from '../app.js'
import { prisma } from '../../prisma/prisma.js'
import { useIntegrationTestHooks } from './integration/helpers.js'

describe('Observability', () => {
    describe('Request ID', () => {
        it('should return X-Request-Id header on every response', async () => {
            const response = await request(app).get('/')

            expect(response.headers['x-request-id']).toBeTruthy()
            expect(response.body.requestId).toBe(
                response.headers['x-request-id'],
            )
        })

        it('should propagate client-provided X-Request-Id', async () => {
            const clientRequestId = 'client-request-id-123'

            const response = await request(app)
                .get('/')
                .set('X-Request-Id', clientRequestId)

            expect(response.headers['x-request-id']).toBe(clientRequestId)
        })

        it('should include requestId in validation error responses', async () => {
            const response = await request(app)
                .post('/api/users/login')
                .send({})

            expect(response.status).toBe(400)
            expect(response.headers['x-request-id']).toBeTruthy()
            expect(response.body.requestId).toBe(
                response.headers['x-request-id'],
            )
            expect(response.body.stack).toBeUndefined()
        })
    })

    describe('GET /health', () => {
        it('should return API status, environment, uptime and timestamp', async () => {
            const response = await request(app).get('/health')

            expect([200, 503]).toContain(response.status)
            expect(response.body.success).toBe(response.status === 200)
            expect(response.body.data).toMatchObject({
                status: expect.stringMatching(/^(ok|degraded)$/),
                environment: expect.any(String),
                uptime: expect.any(Number),
                timestamp: expect.any(String),
                database: {
                    status: expect.stringMatching(/^(connected|disconnected)$/),
                },
                docs: '/docs',
            })
            expect(response.headers['x-request-id']).toBeTruthy()
            expect(response.body.requestId).toBe(
                response.headers['x-request-id'],
            )
        })

        it('should return 503 when database is unavailable', async () => {
            const queryRawSpy = jest
                .spyOn(prisma, '$queryRaw')
                .mockRejectedValueOnce(new Error('connection refused'))

            const response = await request(app).get('/health')

            expect(response.status).toBe(503)
            expect(response.body.data.status).toBe('degraded')
            expect(response.body.data.database.status).toBe('disconnected')

            queryRawSpy.mockRestore()
        })
    })

    describe('GET /health with database', () => {
        useIntegrationTestHooks()

        it('should report database as connected', async () => {
            const response = await request(app).get('/health')

            expect(response.status).toBe(200)
            expect(response.body.data.status).toBe('ok')
            expect(response.body.data.database.status).toBe('connected')
        })
    })
})
