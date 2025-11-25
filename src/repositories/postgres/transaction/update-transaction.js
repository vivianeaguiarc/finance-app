import { prisma } from '../../../../prisma/prisma.js'

import { TransactionNotFoundError } from '../../../errors/transaction.js'

export class PostgresUpdateTransactionRepository {
    async execute(transactionId, updateTransactionParams) {
        try {
            return await prisma.transaction.update({
                where: { id: transactionId },
                data: updateTransactionParams,
            })
        } catch (error) {
            if (error?.code === 'P2025') {
                throw new TransactionNotFoundError(transactionId)
            }
            throw error
        }
    }
}
