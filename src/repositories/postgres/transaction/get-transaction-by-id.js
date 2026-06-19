import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetTransactionByIdRepository {
    async execute(transactionId, userId = null) {
        const where = { id: transactionId }

        if (userId) {
            where.user_id = userId
        }

        return await prisma.transaction.findFirst({
            where,
        })
    }
}
