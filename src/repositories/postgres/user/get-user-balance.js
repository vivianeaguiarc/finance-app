import { prisma } from '../../../../prisma/prisma.js'

export const PostgresGetUserBalanceRepository = {
    async execute(userId) {
        const totalExpenses = await prisma.transaction.aggregate({
            where: { user_id: userId, type: 'EXPENSE' },
            _sum: { amount: true },
        })
        const totalEarnings = await prisma.transaction.aggregate({
            where: { user_id: userId, type: 'EARNING' },
            _sum: { amount: true },
        })
        const totalInvestments = await prisma.transaction.aggregate({
            where: { user_id: userId, type: 'INVESTMENT' },
            _sum: { amount: true },
        })
        // antes
        // depois (normaliza o Decimal/string para número)
        const _totalEarnings = Number(totalEarnings._sum.amount ?? 0)
        const _totalExpenses = Number(totalExpenses._sum.amount ?? 0)
        const _totalInvestments = Number(totalInvestments._sum.amount ?? 0)

        const balance = _totalEarnings - _totalExpenses - _totalInvestments

        return {
            earnings: _totalEarnings,
            expenses: _totalExpenses,
            investments: _totalInvestments,
            balance,
        }
    },
}
