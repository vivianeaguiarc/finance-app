import pkg from '@prisma/client'

const { Prisma } = pkg

import {
    resolveDashboardDateRange,
    decimalToAmount,
} from './dashboard-query.js'

export const MAX_REPORT_TRANSACTIONS = 5000

export function buildReportWhere(userId, filters) {
    const where = { user_id: userId }

    if (filters.type) {
        where.type = filters.type
    }

    if (filters.categoryId) {
        where.category_id = filters.categoryId
    }

    const { startDate, endDate } = resolveDashboardDateRange(filters)

    if (startDate || endDate) {
        where.date = {}

        if (startDate) {
            where.date.gte = new Date(startDate)
        }

        if (endDate) {
            where.date.lte = new Date(endDate)
        }
    }

    return where
}

export function buildReportPeriod(filters) {
    const { startDate, endDate } = resolveDashboardDateRange(filters)

    return {
        startDate: startDate ?? null,
        endDate: endDate ?? null,
        month: filters.month ?? null,
        year: filters.year ?? null,
    }
}

export function buildReportSummary({
    earningsSum,
    expensesSum,
    investmentsSum,
    totalCount,
}) {
    const earnings = toDecimal(earningsSum)
    const expenses = toDecimal(expensesSum)
    const investments = toDecimal(investmentsSum)
    const balance = earnings.minus(expenses).minus(investments)

    return {
        totalEarnings: decimalToAmount(earnings),
        totalExpenses: decimalToAmount(expenses),
        totalInvestments: decimalToAmount(investments),
        balance: decimalToAmount(balance),
        transactionCount: totalCount,
    }
}

function toDecimal(value) {
    if (value === null || value === undefined) {
        return new Prisma.Decimal(0)
    }

    return new Prisma.Decimal(value)
}

export function serializeReportTransaction(transaction) {
    return {
        name: transaction.name,
        date:
            transaction.date instanceof Date
                ? transaction.date.toISOString()
                : transaction.date,
        type: transaction.type,
        amount: decimalToAmount(transaction.amount),
        categoryName: transaction.category?.name ?? transaction.name,
    }
}
