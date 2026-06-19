export const CACHE_PREFIX = 'finance-app'

export const CACHE_TTL = {
    balance: 120,
    transactions: 60,
}

function normalizeDate(value) {
    if (value === undefined || value === null || value === '') {
        return 'all'
    }

    return String(value)
}

export function buildBalanceCacheKey(userId, from, to) {
    return `${CACHE_PREFIX}:user:${userId}:balance:${normalizeDate(from)}:${normalizeDate(to)}`
}

export function buildTransactionsCacheKey(userId, query = {}) {
    const normalized = {
        page: query.page ?? 1,
        limit: query.limit ?? 10,
        type: query.type ?? 'all',
        startDate: normalizeDate(query.startDate),
        endDate: normalizeDate(query.endDate),
        from: normalizeDate(query.from),
        to: normalizeDate(query.to),
        minAmount: query.minAmount ?? 'all',
        maxAmount: query.maxAmount ?? 'all',
        sortBy: query.sortBy ?? 'date',
        sortOrder: query.sortOrder ?? 'desc',
    }

    const filters = Object.keys(normalized)
        .sort()
        .map((key) => `${key}=${normalized[key]}`)
        .join('&')

    return `${CACHE_PREFIX}:user:${userId}:transactions:${filters}`
}

export function buildUserCachePattern(userId) {
    return `${CACHE_PREFIX}:user:${userId}:*`
}
