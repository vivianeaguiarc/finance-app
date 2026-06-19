import { prisma } from '../../../../prisma/prisma.js'

export class PostgresListMonthlyBudgetsRepository {
    async execute(userId, filters = {}) {
        const where = { user_id: userId }

        if (filters.month !== undefined) {
            where.month = filters.month
        }

        if (filters.year !== undefined) {
            where.year = filters.year
        }

        return prisma.monthlyBudget.findMany({
            where,
            include: { category: true },
            orderBy: [{ year: 'desc' }, { month: 'desc' }],
        })
    }
}
