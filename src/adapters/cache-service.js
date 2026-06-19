import Redis from 'ioredis'
import { logger } from '../config/logger.js'
import { buildUserCachePattern } from '../utils/cache-keys.js'

export class CacheService {
    constructor(options = {}) {
        this.redisUrl = options.redisUrl ?? process.env.REDIS_URL ?? null
        this.redis = null
        this.redisEnabled = false
        this.fallback = new Map()
        this.userKeyIndex = new Map()
        this.initialized = false
    }

    async init() {
        if (this.initialized) {
            return
        }

        this.initialized = true

        if (!this.redisUrl) {
            logger.info('REDIS_URL not set — using in-memory cache fallback')
            return
        }

        try {
            this.redis = new Redis(this.redisUrl, {
                maxRetriesPerRequest: 1,
                connectTimeout: 3000,
                lazyConnect: true,
                enableOfflineQueue: false,
            })

            this.redis.on('error', (error) => {
                logger.warn(
                    { err: error },
                    'Redis error — using in-memory fallback',
                )
                this.redisEnabled = false
            })

            await this.redis.connect()
            await this.redis.ping()
            this.redisEnabled = true
            logger.info('Redis cache connected')
        } catch (error) {
            logger.warn(
                { err: error },
                'Redis unavailable — using in-memory cache fallback',
            )
            this.redisEnabled = false

            if (this.redis) {
                this.redis.disconnect()
                this.redis = null
            }
        }
    }

    handleRedisFailure(error) {
        logger.warn(
            { err: error },
            'Redis operation failed — using in-memory fallback',
        )
        this.redisEnabled = false
    }

    getFallback(key) {
        const entry = this.fallback.get(key)

        if (!entry) {
            return null
        }

        if (entry.expiresAt <= Date.now()) {
            this.fallback.delete(key)
            return null
        }

        return entry.value
    }

    setFallback(key, value, ttlSeconds, userId) {
        this.fallback.set(key, {
            value,
            expiresAt: Date.now() + ttlSeconds * 1000,
        })

        if (userId) {
            this.trackUserKey(userId, key)
        }
    }

    trackUserKey(userId, key) {
        if (!this.userKeyIndex.has(userId)) {
            this.userKeyIndex.set(userId, new Set())
        }

        this.userKeyIndex.get(userId).add(key)
    }

    invalidateUserFallback(userId) {
        const trackedKeys = this.userKeyIndex.get(userId)

        if (trackedKeys) {
            for (const key of trackedKeys) {
                this.fallback.delete(key)
            }

            this.userKeyIndex.delete(userId)
        }

        const prefix = `finance-app:user:${userId}:`
        for (const key of this.fallback.keys()) {
            if (key.startsWith(prefix)) {
                this.fallback.delete(key)
            }
        }
    }

    async scanKeys(pattern) {
        if (!this.redis) {
            return []
        }

        const keys = []
        let cursor = '0'

        do {
            const [nextCursor, batch] = await this.redis.scan(
                cursor,
                'MATCH',
                pattern,
                'COUNT',
                100,
            )
            cursor = nextCursor
            keys.push(...batch)
        } while (cursor !== '0')

        return keys
    }

    async get(key) {
        try {
            if (this.redisEnabled && this.redis) {
                const raw = await this.redis.get(key)
                return raw ? JSON.parse(raw) : null
            }
        } catch (error) {
            this.handleRedisFailure(error)
        }

        return this.getFallback(key)
    }

    async set(key, value, ttlSeconds, userId) {
        try {
            if (this.redisEnabled && this.redis) {
                await this.redis.set(
                    key,
                    JSON.stringify(value),
                    'EX',
                    ttlSeconds,
                )
                return
            }
        } catch (error) {
            this.handleRedisFailure(error)
        }

        this.setFallback(key, value, ttlSeconds, userId)
    }

    async invalidateUserCache(userId) {
        const pattern = buildUserCachePattern(userId)

        try {
            if (this.redisEnabled && this.redis) {
                const keys = await this.scanKeys(pattern)

                if (keys.length > 0) {
                    await this.redis.del(...keys)
                }
            }
        } catch (error) {
            this.handleRedisFailure(error)
        }

        this.invalidateUserFallback(userId)
    }

    resetForTests() {
        this.fallback.clear()
        this.userKeyIndex.clear()
        this.redisEnabled = false

        if (this.redis) {
            this.redis.disconnect()
            this.redis = null
        }

        this.initialized = false
    }
}

let cacheServiceInstance = null

export function getCacheService() {
    if (!cacheServiceInstance) {
        cacheServiceInstance = new CacheService()
    }

    return cacheServiceInstance
}

export function resetCacheServiceForTests() {
    if (cacheServiceInstance) {
        cacheServiceInstance.resetForTests()
    }

    cacheServiceInstance = null
}
