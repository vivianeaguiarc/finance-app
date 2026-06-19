import pkg from '@prisma/client'

const { TransactionType } = pkg

import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetCategorySpentRepository {
    async execute(userId, categoryId, month, year) {
        const start = new Date(Date.UTC(year, month - 1, 1))
        const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999))

        const result = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                category_id: categoryId,
                type: TransactionType.EXPENSE,
                date: {
                    gte: start,
                    lte: end,
                },
            },
            _sum: { amount: true },
        })

        return result._sum.amount ?? 0
    }
}
