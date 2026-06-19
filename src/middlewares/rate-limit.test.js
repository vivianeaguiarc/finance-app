import express from 'express'
import cors from 'cors'
import request from 'supertest'
import { createAuthLimiter } from './rate-limit.js'

describe('Rate limit middleware', () => {
    it('should return 429 with standardized message on auth routes', async () => {
        const app = express()
        app.use(express.json())
        app.post(
            '/login',
            createAuthLimiter({ max: 2, windowMs: 60_000 }),
            (_req, res) => {
                res.status(200).json({ ok: true })
            },
        )

        await request(app).post('/login').send({}).expect(200)
        await request(app).post('/login').send({}).expect(200)

        const response = await request(app).post('/login').send({}).expect(429)

        expect(response.body).toEqual({
            success: false,
            message:
                'Too many authentication attempts, please try again later.',
            code: 'TOO_MANY_REQUESTS',
        })
    })
})
