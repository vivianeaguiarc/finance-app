import { prisma } from '../../../../prisma/prisma.js'

export class PostgresTransactionGetByIdRepository {
    async execute(transactionId) {
        return await prisma.transaction.findUnique({
            where: { id: transactionId },
        })
    }
}
