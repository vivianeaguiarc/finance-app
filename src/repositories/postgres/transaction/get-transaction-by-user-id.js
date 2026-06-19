import { prisma } from '../../../../prisma/prisma.js'
import {
    TRANSACTION_SELECT,
    buildTransactionOrderBy,
    buildTransactionWhere,
} from '../../../utils/transaction-query.js'

export class PostgresGetTransactionsByUserIdRepository {
    async execute(userId, filters) {
        const where = buildTransactionWhere(userId, filters)
        const orderBy = buildTransactionOrderBy(
            filters.sortBy,
            filters.sortOrder,
        )
        const skip = (filters.page - 1) * filters.limit
        const take = filters.limit

        const [items, total] = await prisma.$transaction([
            prisma.transaction.findMany({
                where,
                orderBy,
                skip,
                take,
                select: TRANSACTION_SELECT,
            }),
            prisma.transaction.count({ where }),
        ])

        return { items, total }
    }
}
