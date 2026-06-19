import pinoHttp from 'pino-http'
import { logger } from '../config/logger.js'
import { REQUEST_ID_HEADER } from './request-id.js'

export const requestLogger = pinoHttp({
    logger,
    genReqId: (req) => req.id,
    customProps: (req, res) => ({
        requestId: req.id,
        environment: process.env.NODE_ENV || 'development',
    }),
    customSuccessMessage: (req, res) => `${req.method} ${req.url} completed`,
    customErrorMessage: (req, res, error) => `${req.method} ${req.url} failed`,
    customReceivedMessage: (req) => `${req.method} ${req.url} received`,
    serializers: {
        req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url,
            requestId: req.headers[REQUEST_ID_HEADER] ?? req.id,
        }),
        res: (res) => ({
            statusCode: res.statusCode,
        }),
    },
})
