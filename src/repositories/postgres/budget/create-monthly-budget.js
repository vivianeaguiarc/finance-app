import { prisma } from '../../../../prisma/prisma.js'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js'
import { BudgetAlreadyExistsError } from '../../../errors/budget.js'

export class PostgresCreateMonthlyBudgetRepository {
    async execute({ id, userId, categoryId, month, year, limitAmount }) {
        try {
            return await prisma.monthlyBudget.create({
                data: {
                    id,
                    user_id: userId,
                    category_id: categoryId,
                    month,
                    year,
                    limit_amount: limitAmount,
                },
                include: {
                    category: true,
                },
            })
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                throw new BudgetAlreadyExistsError()
            }

            throw error
        }
    }
}
