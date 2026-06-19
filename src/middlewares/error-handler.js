import { ZodError } from 'zod'
import { AppError } from '../errors/app-error.js'
import { CORS_FORBIDDEN_MESSAGE } from '../config/cors.js'
import { mapPrismaError } from '../utils/prisma-error-mapper.js'
import { errorResponse } from '../controllers/helpers/http.js'

export function logInternalError(error) {
    if (process.env.NODE_ENV !== 'production') {
        console.error(error)
    }
}

export function formatErrorBody(statusCode, message, code) {
    return errorResponse(statusCode, message, code).body
}

export function errorHandler(error, req, res, next) {
    logInternalError(error)

    if (error.message === CORS_FORBIDDEN_MESSAGE) {
        return res
            .status(403)
            .json(formatErrorBody(403, CORS_FORBIDDEN_MESSAGE, 'FORBIDDEN'))
    }

    if (error instanceof AppError) {
        return res
            .status(error.statusCode)
            .json(formatErrorBody(error.statusCode, error.message, error.code))
    }

    if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Invalid data provided.'
        return res
            .status(400)
            .json(formatErrorBody(400, message, 'VALIDATION_ERROR'))
    }

    const prismaError = mapPrismaError(error)
    if (prismaError) {
        return res.status(prismaError.statusCode).json(prismaError.body)
    }

    return res
        .status(500)
        .json(formatErrorBody(500, 'Internal server error', 'INTERNAL_ERROR'))
}
