import express from 'express'
import cors from 'cors'
import request from 'supertest'
import { getCorsOptions, CORS_FORBIDDEN_MESSAGE } from '../config/cors.js'
import { errorHandler } from '../middlewares/error-handler.js'
import { app } from '../app.js'

describe('Security hardening integration', () => {
    const originalEnv = { ...process.env }

    afterEach(() => {
        process.env = { ...originalEnv }
    })

    it('GET /docs should remain accessible with helmet enabled', async () => {
        const response = await request(app).get('/docs/')

        expect([200, 301, 302, 304]).toContain(response.status)
    })

    it('should allow configured development origin', async () => {
        process.env.NODE_ENV = 'development'
        process.env.FRONTEND_URL = 'http://localhost:5173'

        const testApp = express()
        testApp.use(cors(getCorsOptions()))
        testApp.get('/health', (_req, res) => res.json({ ok: true }))
        testApp.use(errorHandler)

        const response = await request(testApp)
            .get('/health')
            .set('Origin', 'http://localhost:5173')
            .expect(200)

        expect(response.headers['access-control-allow-origin']).toBe(
            'http://localhost:5173',
        )
    })

    it('should block unauthorized origin in production', async () => {
        process.env.NODE_ENV = 'production'
        process.env.FRONTEND_URL = 'https://finance-app.example.com'

        const testApp = express()
        testApp.use(cors(getCorsOptions()))
        testApp.get('/health', (_req, res) => res.json({ ok: true }))
        testApp.use(errorHandler)

        const response = await request(testApp)
            .get('/health')
            .set('Origin', 'https://evil.example.com')

        expect(response.status).toBe(403)
        expect(response.body).toEqual({
            message: CORS_FORBIDDEN_MESSAGE,
        })
    })
})
