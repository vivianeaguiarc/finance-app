import pkg from '@prisma/client'

const { Prisma, TransactionType } = pkg

import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetUserBalanceRepository {
    async execute(userId, from, to) {
        const dateFilter = {
            date: { gte: new Date(from), lte: new Date(to) },
        }
        const totalExpenses = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: TransactionType.EXPENSE,
                ...dateFilter,
            },
            _sum: { amount: true },
        })
        const totalEarnings = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: TransactionType.EARNING,
                ...dateFilter,
            },
            _sum: { amount: true },
        })
        const totalInvestments = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: TransactionType.INVESTMENT,
                ...dateFilter,
            },
            _sum: { amount: true },
        })

        const _totalEarnings =
            totalEarnings._sum.amount ?? new Prisma.Decimal(0)
        const _totalExpenses =
            totalExpenses._sum.amount ?? new Prisma.Decimal(0)
        const _totalInvestments =
            totalInvestments._sum.amount ?? new Prisma.Decimal(0)

        const total = _totalEarnings
            .plus(_totalExpenses)
            .plus(_totalInvestments)

        const balance = new Prisma.Decimal(_totalEarnings)
            .minus(new Prisma.Decimal(_totalExpenses))
            .minus(new Prisma.Decimal(_totalInvestments))
        const earningsPercent = total.isZero()
            ? 0
            : _totalEarnings.div(total).times(100).toNumber()
        const expensesPercent = total.isZero()
            ? 0
            : _totalExpenses.div(total).times(100).toNumber()
        const investmentsPercent = total.isZero()
            ? 0
            : _totalInvestments.div(total).times(100).toNumber()
        return {
            earnings: _totalEarnings,
            expenses: _totalExpenses,
            investments: _totalInvestments,
            earningsPercent,
            expensesPercent,
            investmentsPercent,
            balance,
        }
    }
}
