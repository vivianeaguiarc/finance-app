import { prisma } from '../../../../prisma/prisma.js'

export const PostgresGetUserBalanceRepository = {
    async execute(userId) {
        const {
            _sum: { amount: totalExpenses },
        } = await prisma.expense.aggregate({
            where: {
                userId: userId,
                type: 'EXPENSE',
            },
            _sum: {
                amount: true,
            },
        })
        const {
            _sum: { amount: totalEarnings },
        } = await prisma.earning.aggregate({
            where: {
                userId: userId,
                type: 'EARNING',
            },
            _sum: {
                amount: true,
            },
        })
        const {
            _sum: { amount: totalInvestments },
        } = await prisma.investment.aggregate({
            where: {
                userId: userId,
                type: 'INVESTMENT',
            },
            _sum: {
                amount: true,
            },
        })
        const _totalEarnings = totalEarnings || 0
        const _totalExpenses = totalExpenses || 0
        const _totalInvestments = totalInvestments || 0

        const balance = _totalEarnings - _totalExpenses - _totalInvestments
        return {
            earnings: _totalEarnings,
            expenses: _totalExpenses,
            investments: _totalInvestments,
            balance: balance,
        }
    },
}
