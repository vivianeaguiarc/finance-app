import { prisma } from '../../../../prisma/prisma.js'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js'
import { CategoryAlreadyExistsError } from '../../../errors/category.js'

export class PostgresCreateCategoryRepository {
    async execute({ id, userId, name }) {
        try {
            return await prisma.category.create({
                data: {
                    id,
                    user_id: userId,
                    name,
                },
            })
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                throw new CategoryAlreadyExistsError(name)
            }

            throw error
        }
    }
}
