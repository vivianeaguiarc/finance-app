import { prisma } from '../../../../prisma/prisma.js'

export class PostgresListCategoriesRepository {
    async execute(userId) {
        return prisma.category.findMany({
            where: { user_id: userId },
            orderBy: { name: 'asc' },
        })
    }
}
