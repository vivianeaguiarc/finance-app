import pkg from '@prisma/client'
const { PrismaClientKnownRequestError } = pkg
import { prisma } from '../../../../prisma/prisma.js'
import { TransactionNotFoundError } from '../../../errors/index.js'

export class PostgresDeleteTransactionRepository {
    async execute(transactionId, userId) {
        try {
            const result = await prisma.transaction.deleteMany({
                where: {
                    id: transactionId,
                    user_id: userId,
                },
            })

            if (result.count === 0) {
                throw new TransactionNotFoundError(transactionId)
            }
        } catch (error) {
            if (error instanceof TransactionNotFoundError) {
                throw error
            }

            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new TransactionNotFoundError(transactionId)
                }
            }

            throw error
        }
    }
}
