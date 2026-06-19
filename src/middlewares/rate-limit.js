import rateLimit from 'express-rate-limit'
import { tooManyRequests } from '../controllers/helpers/http.js'

const noopLimiter = (_req, _res, next) => next()

const tooManyRequestsHandler = (message, code) => (_req, res) => {
    const { statusCode, body } = tooManyRequests(message, code)
    res.status(statusCode).json(body)
}

export function createGlobalLimiter() {
    return rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 300,
        standardHeaders: true,
        legacyHeaders: false,
        handler: tooManyRequestsHandler(
            'Too many requests, please try again later.',
            'TOO_MANY_REQUESTS',
        ),
    })
}

export function createAuthLimiter({
    max = 20,
    windowMs = 15 * 60 * 1000,
} = {}) {
    return rateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        handler: tooManyRequestsHandler(
            'Too many authentication attempts, please try again later.',
            'TOO_MANY_REQUESTS',
        ),
    })
}

export const globalLimiter =
    process.env.NODE_ENV === 'test' ? noopLimiter : createGlobalLimiter()

export const authLimiter =
    process.env.NODE_ENV === 'test' ? noopLimiter : createAuthLimiter()
