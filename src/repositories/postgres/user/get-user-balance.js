import pkg from '@prisma/client'

const { Prisma, TransactionType } = pkg

import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetUserBalanceRepository {
    async execute(userId) {
        const totalExpenses = await prisma.transaction.aggregate({
            where: { user_id: userId, type: TransactionType.EXPENSE },
            _sum: { amount: true },
        })
        const totalEarnings = await prisma.transaction.aggregate({
            where: { user_id: userId, type: TransactionType.EARNING },
            _sum: { amount: true },
        })
        const totalInvestments = await prisma.transaction.aggregate({
            where: { user_id: userId, type: TransactionType.INVESTMENT },
            _sum: { amount: true },
        })

        const _totalEarnings =
            totalEarnings._sum.amount ?? new Prisma.Decimal(0)
        const _totalExpenses =
            totalExpenses._sum.amount ?? new Prisma.Decimal(0)
        const _totalInvestments =
            totalInvestments._sum.amount ?? new Prisma.Decimal(0)

        const balance = new Prisma.Decimal(_totalEarnings)
            .minus(new Prisma.Decimal(_totalExpenses))
            .minus(new Prisma.Decimal(_totalInvestments))

        return {
            earnings: _totalEarnings,
            expenses: _totalExpenses,
            investments: _totalInvestments,
            balance,
        }
    }
}
