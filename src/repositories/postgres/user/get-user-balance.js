// import pkg from '@prisma/client'

// const { Prisma, TransactionType } = pkg

// import { prisma } from '../../../../prisma/prisma.js'

// export class PostgresGetUserBalanceRepository {
//     async execute(userId, from, to) {
//         const dateFilter = {
//             date: { gte: new Date(from), lte: new Date(to) },
//         }
//         const totalExpenses = await prisma.transaction.aggregate({
//             where: {
//                 user_id: userId,
//                 type: TransactionType.EXPENSE,
//                 ...dateFilter,
//             },
//             _sum: { amount: true },
//         })
//         const totalEarnings = await prisma.transaction.aggregate({
//             where: {
//                 user_id: userId,
//                 type: TransactionType.EARNING,
//                 ...dateFilter,
//             },
//             _sum: { amount: true },
//         })
//         const totalInvestments = await prisma.transaction.aggregate({
//             where: {
//                 user_id: userId,
//                 type: TransactionType.INVESTMENT,
//                 ...dateFilter,
//             },
//             _sum: { amount: true },
//         })

//         const _totalEarnings =
//             totalEarnings._sum.amount ?? new Prisma.Decimal(0)
//         const _totalExpenses =
//             totalExpenses._sum.amount ?? new Prisma.Decimal(0)
//         const _totalInvestments =
//             totalInvestments._sum.amount ?? new Prisma.Decimal(0)

//         const total = _totalEarnings
//             .plus(_totalExpenses)
//             .plus(_totalInvestments)

//         const balance = new Prisma.Decimal(_totalEarnings)
//             .minus(new Prisma.Decimal(_totalExpenses))
//             .minus(new Prisma.Decimal(_totalInvestments))
//         const earningsPercent = total.isZero()
//             ? 0
//             : _totalEarnings.div(total).times(100).toNumber()
//         const expensesPercent = total.isZero()
//             ? 0
//             : _totalExpenses.div(total).times(100).toNumber()
//         const investmentsPercent = total.isZero()
//             ? 0
//             : _totalInvestments.div(total).times(100).toNumber()
//         return {
//             earnings: result.earnings.toString(),
//             expenses: result.expenses.toString(),
//             investments: result.investments.toString(),
//             balance: result.balance.toString(),
//             earningsPercentage: Math.round(result.earningsPercent).toString(),
//             expensesPercentage: Math.round(result.expensesPercent).toString(),
//             investmentsPercentage: Math.round(
//                 result.investmentsPercent,
//             ).toString(),
//         }

//     }
// }
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

        const earnings = totalEarnings._sum.amount ?? new Prisma.Decimal(0)
        const expenses = totalExpenses._sum.amount ?? new Prisma.Decimal(0)
        const investments =
            totalInvestments._sum.amount ?? new Prisma.Decimal(0)

        // Soma total absoluta (para cálculo de %)
        const total = earnings.plus(expenses).plus(investments)

        // Balance = ganhos - gastos - investimentos
        const balance = earnings.minus(expenses).minus(investments)

        const earningsPercentage = total.isZero()
            ? 0
            : Math.round(earnings.div(total).times(100).toNumber())

        const expensesPercentage = total.isZero()
            ? 0
            : Math.round(expenses.div(total).times(100).toNumber())

        const investmentsPercentage = total.isZero()
            ? 0
            : Math.round(investments.div(total).times(100).toNumber())

        return {
            earnings: earnings.toString(),
            expenses: expenses.toString(),
            investments: investments.toString(),
            balance: balance.toString(),
            earningsPercentage: earningsPercentage.toString(),
            expensesPercentage: expensesPercentage.toString(),
            investmentsPercentage: investmentsPercentage.toString(),
        }
    }
}
