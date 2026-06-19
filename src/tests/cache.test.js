import {
    CacheService,
    resetCacheServiceForTests,
} from '../adapters/cache-service.js'
import {
    buildBalanceCacheKey,
    buildTransactionsCacheKey,
} from '../utils/cache-keys.js'
import { GetUserBalanceUseCase } from '../use-cases/user/get-user-balance.js'
import { GetTransactionByUserIdUseCase } from '../use-cases/transaction/get-transaction-by-user-id.js'
import { CreateTransactionUseCase } from '../use-cases/transaction/create-transaction.js'

describe('CacheService', () => {
    afterEach(() => {
        resetCacheServiceForTests()
    })

    it('should store and retrieve values in memory when REDIS_URL is not set', async () => {
        const cache = new CacheService({ redisUrl: null })
        await cache.init()

        await cache.set(
            buildBalanceCacheKey('user-1', null, null),
            { balance: '100' },
            60,
            'user-1',
        )
        const value = await cache.get(
            buildBalanceCacheKey('user-1', null, null),
        )

        expect(value).toEqual({ balance: '100' })
    })

    it('should invalidate all cache keys for a user', async () => {
        const cache = new CacheService({ redisUrl: null })
        await cache.init()

        await cache.set(
            buildBalanceCacheKey('user-1', null, null),
            { balance: '100' },
            60,
            'user-1',
        )
        await cache.set(
            buildTransactionsCacheKey('user-1', { page: 1, limit: 10 }),
            { items: [], total: 0 },
            60,
            'user-1',
        )

        await cache.invalidateUserCache('user-1')

        expect(
            await cache.get(buildBalanceCacheKey('user-1', null, null)),
        ).toBeNull()
        expect(
            await cache.get(
                buildTransactionsCacheKey('user-1', { page: 1, limit: 10 }),
            ),
        ).toBeNull()
    })

    it('should continue working when Redis connection fails', async () => {
        const cache = new CacheService({
            redisUrl: 'redis://127.0.0.1:6399',
        })
        await cache.init()

        await cache.set('finance-app:test:key', { ok: true }, 60, 'user-1')

        expect(await cache.get('finance-app:test:key')).toEqual({ ok: true })
        expect(cache.redisEnabled).toBe(false)
    })
})

describe('Read use cases with cache', () => {
    let cache

    beforeEach(async () => {
        resetCacheServiceForTests()
        cache = new CacheService({ redisUrl: null })
        await cache.init()
    })

    afterEach(() => {
        resetCacheServiceForTests()
    })

    it('should hit repository only once for repeated balance reads', async () => {
        const getUserBalanceRepository = {
            execute: jest.fn().mockResolvedValue({
                earnings: '100',
                expenses: '20',
                investments: '10',
                balance: '70',
            }),
        }
        const getUserByIdRepository = {
            execute: jest.fn().mockResolvedValue({ id: 'user-1' }),
        }

        const sut = new GetUserBalanceUseCase(
            getUserBalanceRepository,
            getUserByIdRepository,
            cache,
        )

        await sut.execute('user-1', null, null)
        await sut.execute('user-1', null, null)

        expect(getUserBalanceRepository.execute).toHaveBeenCalledTimes(1)
        expect(getUserByIdRepository.execute).toHaveBeenCalledTimes(1)
    })

    it('should keep cache isolated per userId', async () => {
        const getUserBalanceRepository = {
            execute: jest
                .fn()
                .mockResolvedValueOnce({
                    earnings: '100',
                    expenses: '0',
                    investments: '0',
                    balance: '100',
                })
                .mockResolvedValueOnce({
                    earnings: '200',
                    expenses: '0',
                    investments: '0',
                    balance: '200',
                }),
        }
        const getUserByIdRepository = {
            execute: jest.fn().mockResolvedValue({ id: 'user' }),
        }

        const sut = new GetUserBalanceUseCase(
            getUserBalanceRepository,
            getUserByIdRepository,
            cache,
        )

        const userOneBalance = await sut.execute('user-1', null, null)
        const userTwoBalance = await sut.execute('user-2', null, null)
        const userOneCachedBalance = await sut.execute('user-1', null, null)

        expect(userOneBalance.balance).toBe('100')
        expect(userTwoBalance.balance).toBe('200')
        expect(userOneCachedBalance.balance).toBe('100')
        expect(getUserBalanceRepository.execute).toHaveBeenCalledTimes(2)
    })

    it('should hit repository only once for repeated transaction list reads', async () => {
        const getTransactionByUserIdRepository = {
            execute: jest
                .fn()
                .mockResolvedValue({ items: [{ id: 'tx-1' }], total: 1 }),
        }
        const getUserByIdRepository = {
            execute: jest.fn().mockResolvedValue({ id: 'user-1' }),
        }

        const sut = new GetTransactionByUserIdUseCase(
            getTransactionByUserIdRepository,
            getUserByIdRepository,
            cache,
        )

        const query = { page: 1, limit: 10, sortBy: 'date', sortOrder: 'desc' }

        await sut.execute('user-1', query)
        await sut.execute('user-1', query)

        expect(getTransactionByUserIdRepository.execute).toHaveBeenCalledTimes(
            1,
        )
    })
})

describe('Cache invalidation on writes', () => {
    let cache

    beforeEach(async () => {
        resetCacheServiceForTests()
        cache = new CacheService({ redisUrl: null })
        await cache.init()
    })

    afterEach(() => {
        resetCacheServiceForTests()
    })

    it('should invalidate cached balance after creating a transaction', async () => {
        const getUserBalanceRepository = {
            execute: jest
                .fn()
                .mockResolvedValueOnce({
                    earnings: '0',
                    expenses: '0',
                    investments: '0',
                    balance: '0',
                })
                .mockResolvedValueOnce({
                    earnings: '100',
                    expenses: '0',
                    investments: '0',
                    balance: '100',
                }),
        }
        const getUserByIdRepository = {
            execute: jest.fn().mockResolvedValue({ id: 'user-1' }),
        }
        const createTransactionRepository = {
            execute: jest
                .fn()
                .mockResolvedValue({ id: 'tx-1', user_id: 'user-1' }),
        }
        const idGeneratorAdapter = {
            execute: jest.fn().mockReturnValue('tx-1'),
        }
        const getCategoryByIdRepository = {
            execute: jest.fn(),
        }

        const readUseCase = new GetUserBalanceUseCase(
            getUserBalanceRepository,
            getUserByIdRepository,
            cache,
        )
        const createUseCase = new CreateTransactionUseCase(
            createTransactionRepository,
            getUserByIdRepository,
            getCategoryByIdRepository,
            idGeneratorAdapter,
            cache,
        )

        const firstRead = await readUseCase.execute('user-1', null, null)
        await createUseCase.execute({
            user_id: 'user-1',
            name: 'Salary',
            amount: 100,
            type: 'EARNING',
            date: new Date(),
        })
        const secondRead = await readUseCase.execute('user-1', null, null)

        expect(firstRead.balance).toBe('0')
        expect(secondRead.balance).toBe('100')
        expect(getUserBalanceRepository.execute).toHaveBeenCalledTimes(2)
    })
})
