import { ZodError } from 'zod'
import { AppError } from '../../errors/app-error.js'
import { mapPrismaError } from '../../utils/prisma-error-mapper.js'
import { logInternalError } from '../../middlewares/error-handler.js'
import { badRequest, serverError } from './http.js'

export function mapErrorToHttpResponse(error) {
    if (error instanceof AppError) {
        return {
            statusCode: error.statusCode,
            body: {
                success: false,
                message: error.message,
                code: error.code,
            },
        }
    }

    if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Invalid data provided.'
        return badRequest(message, 'VALIDATION_ERROR')
    }

    const prismaError = mapPrismaError(error)
    if (prismaError) {
        return prismaError
    }

    logInternalError(error)
    return serverError()
}
