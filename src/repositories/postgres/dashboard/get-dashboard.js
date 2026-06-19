import pkg from '@prisma/client'

const { Prisma, TransactionType } = pkg

import { prisma } from '../../../../prisma/prisma.js'
import {
    buildDashboardSummary,
    buildDashboardWhere,
    decimalToAmount,
} from '../../../utils/dashboard-query.js'

export class PostgresGetDashboardRepository {
    async execute(userId, filters) {
        const where = buildDashboardWhere(userId, filters)
        const earningWhere = { ...where, type: TransactionType.EARNING }
        const expenseWhere = { ...where, type: TransactionType.EXPENSE }
        const investmentWhere = { ...where, type: TransactionType.INVESTMENT }

        const [
            earningsAggregate,
            expensesAggregate,
            investmentsAggregate,
            totalCount,
            maxEarningAggregate,
            maxExpenseAggregate,
            avgEarningAggregate,
            avgExpenseAggregate,
            byTypeGroups,
            byCategoryGroups,
            byMonthRows,
        ] = await Promise.all([
            prisma.transaction.aggregate({
                where: earningWhere,
                _sum: { amount: true },
            }),
            prisma.transaction.aggregate({
                where: expenseWhere,
                _sum: { amount: true },
            }),
            prisma.transaction.aggregate({
                where: investmentWhere,
                _sum: { amount: true },
            }),
            prisma.transaction.count({ where }),
            prisma.transaction.aggregate({
                where: earningWhere,
                _max: { amount: true },
            }),
            prisma.transaction.aggregate({
                where: expenseWhere,
                _max: { amount: true },
            }),
            prisma.transaction.aggregate({
                where: earningWhere,
                _avg: { amount: true },
            }),
            prisma.transaction.aggregate({
                where: expenseWhere,
                _avg: { amount: true },
            }),
            prisma.transaction.groupBy({
                by: ['type'],
                where,
                _sum: { amount: true },
                _count: { _all: true },
                _avg: { amount: true },
            }),
            prisma.transaction.groupBy({
                by: ['name', 'type'],
                where,
                _sum: { amount: true },
                _count: { _all: true },
            }),
            this.getByMonthAggregates(userId, where),
        ])

        const summary = buildDashboardSummary({
            earningsSum: earningsAggregate._sum.amount,
            expensesSum: expensesAggregate._sum.amount,
            investmentsSum: investmentsAggregate._sum.amount,
            totalCount,
            maxEarning: maxEarningAggregate._max.amount,
            maxExpense: maxExpenseAggregate._max.amount,
            avgEarning: avgEarningAggregate._avg.amount,
            avgExpense: avgExpenseAggregate._avg.amount,
        })

        return {
            summary,
            byCategory: byCategoryGroups
                .map((row) => ({
                    categoryId: row.name,
                    categoryName: row.name,
                    type: row.type,
                    totalAmount: decimalToAmount(row._sum.amount),
                    count: row._count._all,
                }))
                .sort((a, b) => a.categoryName.localeCompare(b.categoryName)),
            byMonth: byMonthRows,
            byType: byTypeGroups
                .map((row) => ({
                    type: row.type,
                    totalAmount: decimalToAmount(row._sum.amount),
                    count: row._count._all,
                    averageAmount: decimalToAmount(row._avg.amount),
                }))
                .sort((a, b) => a.type.localeCompare(b.type)),
        }
    }

    async getByMonthAggregates(userId, where) {
        const conditions = [Prisma.sql`user_id = ${userId}`]

        if (where.date?.gte) {
            conditions.push(Prisma.sql`date >= ${where.date.gte}`)
        }

        if (where.date?.lte) {
            conditions.push(Prisma.sql`date <= ${where.date.lte}`)
        }

        if (where.type) {
            conditions.push(Prisma.sql`type = ${where.type}::"TransactionType"`)
        }

        if (where.name) {
            conditions.push(Prisma.sql`name = ${where.name}`)
        }

        const whereClause = Prisma.join(conditions, ' AND ')

        const rows = await prisma.$queryRaw`
            SELECT
                TO_CHAR(date, 'YYYY-MM') AS month,
                COALESCE(SUM(CASE WHEN type = 'EARNING' THEN amount ELSE 0 END), 0) AS earnings,
                COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) AS expenses,
                COALESCE(SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END), 0) AS investments,
                COUNT(*)::int AS count
            FROM transactions
            WHERE ${whereClause}
            GROUP BY TO_CHAR(date, 'YYYY-MM')
            ORDER BY month ASC
        `

        return rows.map((row) => {
            const earnings = new Prisma.Decimal(row.earnings)
            const expenses = new Prisma.Decimal(row.expenses)
            const investments = new Prisma.Decimal(row.investments)
            const balance = earnings.minus(expenses).minus(investments)

            return {
                month: row.month,
                totalEarnings: decimalToAmount(earnings),
                totalExpenses: decimalToAmount(expenses),
                totalInvestments: decimalToAmount(investments),
                balance: decimalToAmount(balance),
                count: Number(row.count),
            }
        })
    }
}
