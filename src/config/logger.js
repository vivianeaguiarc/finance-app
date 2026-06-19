import pino from 'pino'

const environment = process.env.NODE_ENV || 'development'
const isTest = environment === 'test'
const isProduction = environment === 'production'

const defaultLevel = isTest ? 'silent' : isProduction ? 'info' : 'debug'

export const logger = pino({
    level: process.env.LOG_LEVEL || defaultLevel,
    timestamp: pino.stdTimeFunctions.isoTime,
    base: {
        environment,
        service: 'finance-app',
    },
    redact: {
        paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'password',
            'refreshToken',
            'accessToken',
            'tokens',
            'body.password',
            'body.refreshToken',
            'body.tokens',
            'body.amount',
            'body.name',
            '*.password',
            '*.refreshToken',
            '*.accessToken',
            '*.tokens',
        ],
        censor: '[REDACTED]',
    },
})
