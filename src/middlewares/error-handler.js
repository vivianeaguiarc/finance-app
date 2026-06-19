import { ZodError } from 'zod'
import { AppError } from '../errors/app-error.js'
import { CORS_FORBIDDEN_MESSAGE } from '../config/cors.js'
import { mapPrismaError } from '../utils/prisma-error-mapper.js'
import { logger } from '../config/logger.js'

export function logRequestError(
    error,
    { requestId, method, path, statusCode, message },
) {
    const payload = {
        requestId,
        method,
        path,
        statusCode,
        message: message ?? error?.message,
        err: error,
    }

    if (statusCode >= 500) {
        logger.error(payload, 'Request error')
        return
    }

    logger.warn(payload, 'Request error')
}

export function logInternalError(error, req) {
    logRequestError(error, {
        requestId: req?.id,
        method: req?.method,
        path: req?.originalUrl ?? req?.url,
        statusCode: 500,
        message: error?.message,
    })
}

function withRequestId(body, requestId) {
    if (!requestId || !body || body.success !== false) {
        return body
    }

    return { ...body, requestId }
}

export function formatErrorBody(statusCode, message, code, requestId) {
    return withRequestId(
        {
            success: false,
            message,
            code,
        },
        requestId,
    )
}

export function errorHandler(error, req, res, next) {
    const requestId = req.id
    const path = req.originalUrl ?? req.url

    if (error.message === CORS_FORBIDDEN_MESSAGE) {
        logRequestError(error, {
            requestId,
            method: req.method,
            path,
            statusCode: 403,
            message: CORS_FORBIDDEN_MESSAGE,
        })
        return res
            .status(403)
            .json(
                formatErrorBody(
                    403,
                    CORS_FORBIDDEN_MESSAGE,
                    'FORBIDDEN',
                    requestId,
                ),
            )
    }

    if (error instanceof AppError) {
        logRequestError(error, {
            requestId,
            method: req.method,
            path,
            statusCode: error.statusCode,
            message: error.message,
        })
        return res
            .status(error.statusCode)
            .json(
                formatErrorBody(
                    error.statusCode,
                    error.message,
                    error.code,
                    requestId,
                ),
            )
    }

    if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Invalid data provided.'
        logRequestError(error, {
            requestId,
            method: req.method,
            path,
            statusCode: 400,
            message,
        })
        return res
            .status(400)
            .json(formatErrorBody(400, message, 'VALIDATION_ERROR', requestId))
    }

    const prismaError = mapPrismaError(error)
    if (prismaError) {
        logRequestError(error, {
            requestId,
            method: req.method,
            path,
            statusCode: prismaError.statusCode,
            message: prismaError.body.message,
        })
        return res
            .status(prismaError.statusCode)
            .json(withRequestId(prismaError.body, requestId))
    }

    logInternalError(error, req)

    return res
        .status(500)
        .json(
            formatErrorBody(
                500,
                'Internal server error',
                'INTERNAL_ERROR',
                requestId,
            ),
        )
}
