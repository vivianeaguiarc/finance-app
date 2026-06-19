import { EmailAlreadyInUseError, ForbiddenError } from '../../errors/user.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'
import { AppError } from '../../errors/app-error.js'
import { mapErrorToHttpResponse } from './map-error.js'
import pkg from '@prisma/client'

const { Prisma } = pkg

describe('mapErrorToHttpResponse', () => {
    it('should map AppError to standardized error response', () => {
        const error = new AppError('Custom error', 418, 'TEAPOT')

        expect(mapErrorToHttpResponse(error)).toEqual({
            statusCode: 418,
            body: {
                success: false,
                message: 'Custom error',
                code: 'TEAPOT',
            },
        })
    })

    it('should map duplicate email to 409', () => {
        const response = mapErrorToHttpResponse(new EmailAlreadyInUseError())

        expect(response.statusCode).toBe(409)
        expect(response.body.code).toBe('EMAIL_ALREADY_IN_USE')
    })

    it('should map transaction not found to 404', () => {
        const response = mapErrorToHttpResponse(new TransactionNotFoundError())

        expect(response.statusCode).toBe(404)
        expect(response.body.code).toBe('TRANSACTION_NOT_FOUND')
    })

    it('should map forbidden access to 403', () => {
        const response = mapErrorToHttpResponse(new ForbiddenError())

        expect(response.statusCode).toBe(403)
        expect(response.body.code).toBe('FORBIDDEN')
    })

    it('should map Prisma P2002 to 409', () => {
        const error = new Prisma.PrismaClientKnownRequestError('duplicate', {
            code: 'P2002',
            clientVersion: '6.19.0',
        })

        const response = mapErrorToHttpResponse(error)

        expect(response.statusCode).toBe(409)
        expect(response.body.code).toBe('DUPLICATE_RECORD')
    })

    it('should map Prisma P2025 to 404', () => {
        const error = new Prisma.PrismaClientKnownRequestError('not found', {
            code: 'P2025',
            clientVersion: '6.19.0',
        })

        const response = mapErrorToHttpResponse(error)

        expect(response.statusCode).toBe(404)
        expect(response.body.code).toBe('NOT_FOUND')
    })

    it('should map unexpected errors to 500 without stack trace', () => {
        const response = mapErrorToHttpResponse(new Error('database exploded'))

        expect(response.statusCode).toBe(500)
        expect(response.body).toEqual({
            success: false,
            message: 'Internal server error',
            code: 'INTERNAL_ERROR',
        })
        expect(response.body.stack).toBeUndefined()
    })
})
