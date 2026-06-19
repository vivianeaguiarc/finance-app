import { prisma } from '../../../../prisma/prisma.js'

export class PostgresCreateManyTransactionsRepository {
    async execute(transactions) {
        return prisma.$transaction(async (tx) => {
            const created = []

            for (const transaction of transactions) {
                created.push(
                    await tx.transaction.create({
                        data: transaction,
                    }),
                )
            }

            return created
        })
    }
}
