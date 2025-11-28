import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetTransactionByIdRepository {
    async execute(transactionId, userId) {
        return await prisma.transaction.findFirst({
            where: {
                id: transactionId,
                user_id: userId,
            },
        })
    }
}
