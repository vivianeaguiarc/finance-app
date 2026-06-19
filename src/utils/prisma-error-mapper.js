import pkg from '@prisma/client'

const { Prisma } = pkg

import { errorResponse } from '../controllers/helpers/http.js'

export function mapPrismaError(error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            return errorResponse(
                409,
                'A record with this value already exists.',
                'DUPLICATE_RECORD',
            )
        }

        if (error.code === 'P2025') {
            return errorResponse(404, 'Resource not found.', 'NOT_FOUND')
        }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
        return errorResponse(400, 'Invalid data provided.', 'VALIDATION_ERROR')
    }

    return null
}
