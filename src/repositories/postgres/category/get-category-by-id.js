import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetCategoryByIdRepository {
    async execute(categoryId) {
        return prisma.category.findUnique({
            where: { id: categoryId },
        })
    }
}
