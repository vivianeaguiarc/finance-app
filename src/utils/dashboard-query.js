import pkg from '@prisma/client'

const { Prisma } = pkg

export function resolveDashboardDateRange(query) {
    if (query.startDate || query.endDate) {
        return {
            startDate: query.startDate,
            endDate: query.endDate,
        }
    }

    if (query.month !== undefined) {
        const year = query.year ?? new Date().getUTCFullYear()
        const start = new Date(Date.UTC(year, query.month - 1, 1))
        const end = new Date(Date.UTC(year, query.month, 0, 23, 59, 59, 999))

        return {
            startDate: start.toISOString(),
            endDate: end.toISOString(),
        }
    }

    if (query.year !== undefined) {
        const start = new Date(Date.UTC(query.year, 0, 1))
        const end = new Date(Date.UTC(query.year, 11, 31, 23, 59, 59, 999))

        return {
            startDate: start.toISOString(),
            endDate: end.toISOString(),
        }
    }

    return {}
}

export function buildDashboardWhere(userId, filters) {
    const where = { user_id: userId }

    if (filters.type) {
        where.type = filters.type
    }

    if (filters.categoryId) {
        where.name = filters.categoryId
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

export function decimalToAmount(value) {
    if (value === null || value === undefined) {
        return '0.00'
    }

    return new Prisma.Decimal(value).toFixed(2)
}

export function buildDashboardSummary({
    earningsSum,
    expensesSum,
    investmentsSum,
    totalCount,
    maxEarning,
    maxExpense,
    avgEarning,
    avgExpense,
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
        highestEarning: decimalToAmount(maxEarning),
        highestExpense: decimalToAmount(maxExpense),
        averageEarning: decimalToAmount(avgEarning),
        averageExpense: decimalToAmount(avgExpense),
    }
}

function toDecimal(value) {
    if (value === null || value === undefined) {
        return new Prisma.Decimal(0)
    }

    return new Prisma.Decimal(value)
}
