import {
    buildBalanceCacheKey,
    buildDashboardCacheKey,
    buildTransactionsCacheKey,
    buildUserCachePattern,
    CACHE_TTL,
} from './cache-keys.js'

describe('cache-keys', () => {
    it('should build user-scoped balance keys', () => {
        expect(buildBalanceCacheKey('user-1', null, null)).toBe(
            'finance-app:user:user-1:balance:all:all',
        )
    })

    it('should include filters in transaction list keys', () => {
        const keyA = buildTransactionsCacheKey('user-1', {
            page: 1,
            limit: 10,
            type: 'EXPENSE',
        })
        const keyB = buildTransactionsCacheKey('user-1', {
            page: 2,
            limit: 10,
            type: 'EXPENSE',
        })

        expect(keyA).not.toBe(keyB)
        expect(keyA).toContain('finance-app:user:user-1:transactions:')
    })

    it('should include dashboard filters in cache keys', () => {
        const key = buildDashboardCacheKey('user-1', {
            month: 6,
            year: 2025,
            type: 'EXPENSE',
        })

        expect(key).toBe(
            'finance-app:user:user-1:dashboard:categoryId=all&endDate=all&month=6&startDate=all&type=EXPENSE&year=2025',
        )
    })

    it('should expose invalidation pattern per user', () => {
        expect(buildUserCachePattern('user-1')).toBe(
            'finance-app:user:user-1:*',
        )
    })

    it('should define TTL values between 60 and 300 seconds', () => {
        expect(CACHE_TTL.balance).toBeGreaterThanOrEqual(60)
        expect(CACHE_TTL.balance).toBeLessThanOrEqual(300)
        expect(CACHE_TTL.transactions).toBeGreaterThanOrEqual(60)
        expect(CACHE_TTL.transactions).toBeLessThanOrEqual(300)
        expect(CACHE_TTL.dashboard).toBe(60)
    })
})
