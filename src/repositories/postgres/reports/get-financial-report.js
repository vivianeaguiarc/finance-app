import pkg from '@prisma/client'

const { TransactionType } = pkg

import { prisma } from '../../../../prisma/prisma.js'
import { decimalToAmount } from '../../../utils/dashboard-query.js'
import {
    MAX_REPORT_TRANSACTIONS,
    buildReportSummary,
    buildReportWhere,
    buildReportPeriod,
    serializeReportTransaction,
} from '../../../utils/report-query.js'

export class PostgresGetFinancialReportRepository {
    async execute(userId, filters) {
        const where = buildReportWhere(userId, filters)
        const earningWhere = { ...where, type: TransactionType.EARNING }
        const expenseWhere = { ...where, type: TransactionType.EXPENSE }
        const investmentWhere = { ...where, type: TransactionType.INVESTMENT }

        const [
            earningsAggregate,
            expensesAggregate,
            investmentsAggregate,
            totalCount,
            byTypeGroups,
            byCategoryGroups,
            transactions,
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
            prisma.transaction.groupBy({
                by: ['type'],
                where,
                _sum: { amount: true },
                _count: { _all: true },
            }),
            prisma.transaction.groupBy({
                by: ['category_id', 'type'],
                where,
                _sum: { amount: true },
                _count: { _all: true },
            }),
            prisma.transaction.findMany({
                where,
                orderBy: { date: 'desc' },
                take: MAX_REPORT_TRANSACTIONS,
                select: {
                    name: true,
                    date: true,
                    amount: true,
                    type: true,
                    category: {
                        select: { name: true },
                    },
                },
            }),
        ])

        const categoryIds = [
            ...new Set(
                byCategoryGroups
                    .map((row) => row.category_id)
                    .filter((id) => id !== null),
            ),
        ]

        const categories =
            categoryIds.length > 0
                ? await prisma.category.findMany({
                      where: { id: { in: categoryIds }, user_id: userId },
                      select: { id: true, name: true },
                  })
                : []

        const categoryNameById = new Map(
            categories.map((category) => [category.id, category.name]),
        )

        const summary = buildReportSummary({
            earningsSum: earningsAggregate._sum.amount,
            expensesSum: expensesAggregate._sum.amount,
            investmentsSum: investmentsAggregate._sum.amount,
            totalCount,
        })

        return {
            period: buildReportPeriod(filters),
            summary,
            transactions: transactions.map(serializeReportTransaction),
            byCategory: byCategoryGroups
                .map((row) => ({
                    categoryName:
                        row.category_id != null
                            ? (categoryNameById.get(row.category_id) ??
                              'Uncategorized')
                            : 'Uncategorized',
                    type: row.type,
                    totalAmount: decimalToAmount(row._sum.amount),
                    count: row._count._all,
                }))
                .sort((a, b) => a.categoryName.localeCompare(b.categoryName)),
            byType: byTypeGroups
                .map((row) => ({
                    type: row.type,
                    totalAmount: decimalToAmount(row._sum.amount),
                    count: row._count._all,
                }))
                .sort((a, b) => a.type.localeCompare(b.type)),
            meta: {
                truncated: totalCount > MAX_REPORT_TRANSACTIONS,
                transactionLimit: MAX_REPORT_TRANSACTIONS,
                exportedCount: transactions.length,
            },
        }
    }
}
