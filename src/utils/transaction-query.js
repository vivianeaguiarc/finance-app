import pkg from '@prisma/client'

const { Prisma } = pkg

export const TRANSACTION_SELECT = {
    id: true,
    user_id: true,
    name: true,
    date: true,
    amount: true,
    type: true,
    created_at: true,
}

const SORT_FIELD_MAP = {
    date: 'date',
    amount: 'amount',
    createdAt: 'created_at',
}

export function buildTransactionWhere(userId, filters) {
    const where = { user_id: userId }

    if (filters.type) {
        where.type = filters.type
    }

    if (filters.startDate || filters.endDate) {
        where.date = {}

        if (filters.startDate) {
            where.date.gte = new Date(filters.startDate)
        }

        if (filters.endDate) {
            where.date.lte = new Date(filters.endDate)
        }
    }

    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
        where.amount = {}

        if (filters.minAmount !== undefined) {
            where.amount.gte = new Prisma.Decimal(filters.minAmount)
        }

        if (filters.maxAmount !== undefined) {
            where.amount.lte = new Prisma.Decimal(filters.maxAmount)
        }
    }

    return where
}

export function buildTransactionOrderBy(sortBy, sortOrder) {
    const field = SORT_FIELD_MAP[sortBy] ?? 'date'

    return { [field]: sortOrder }
}

export function buildPaginationMeta(page, limit, total) {
    return {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
    }
}
