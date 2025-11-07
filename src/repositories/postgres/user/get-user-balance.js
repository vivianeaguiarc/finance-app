// import { Prisma } from '@prisma/client'
// import { prisma } from '../../../../prisma/prisma.js'

// export const PostgresGetUserBalanceRepository = {
//     async execute(userId) {
//         const totalExpenses = await prisma.transaction.aggregate({
//             where: { user_id: userId, type: 'EXPENSE' },
//             _sum: { amount: true },
//         })
//         const totalEarnings = await prisma.transaction.aggregate({
//             where: { user_id: userId, type: 'EARNING' },
//             _sum: { amount: true },
//         })
//         const totalInvestments = await prisma.transaction.aggregate({
//             where: { user_id: userId, type: 'INVESTMENT' },
//             _sum: { amount: true },
//         })

//         const _totalEarnings =
//             Number(totalEarnings._sum.amount ?? 0) || new Prisma.Decimal(0)
//         const _totalExpenses =
//             Number(totalExpenses._sum.amount ?? 0) || new Prisma.Decimal(0)
//         const _totalInvestments =
//             Number(totalInvestments._sum.amount ?? 0) || new Prisma.Decimal(0)

//         const balance = new Prisma.Decimal(_totalEarnings)
//             .minus(new Prisma.Decimal(_totalExpenses))
//             .minus(new Prisma.Decimal(_totalInvestments))

//         return {
//             earnings: _totalEarnings,
//             expenses: _totalExpenses,
//             investments: _totalInvestments,
//             balance: balance,
//         }
//     },
// }
// src/repositories/postgres/user/get-user-balance.js
import { Prisma } from '@prisma/client'
import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetUserBalanceRepository {
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
