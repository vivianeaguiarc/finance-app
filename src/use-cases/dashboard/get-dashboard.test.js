import { GetDashboardUseCase } from './get-dashboard.js'
import { UserNotFoundError } from '../../errors/user.js'
import { buildDashboardCacheKey } from '../../utils/cache-keys.js'

describe('GetDashboardUseCase', () => {
    const dashboardPayload = {
        summary: { balance: '100.00', transactionCount: 1 },
        byCategory: [],
        byMonth: [],
        byType: [],
    }

    it('returns cached dashboard when available', async () => {
        const cacheService = {
            get: jest.fn().mockResolvedValue(dashboardPayload),
            set: jest.fn(),
        }
        const getDashboardRepository = { execute: jest.fn() }
        const getUserByIdRepository = { execute: jest.fn() }

        const sut = new GetDashboardUseCase(
            getDashboardRepository,
            getUserByIdRepository,
            cacheService,
        )

        const result = await sut.execute('user-1', { type: 'EXPENSE' })

        expect(result).toEqual(dashboardPayload)
        expect(getDashboardRepository.execute).not.toHaveBeenCalled()
        expect(cacheService.get).toHaveBeenCalledWith(
            buildDashboardCacheKey('user-1', { type: 'EXPENSE' }),
        )
    })

    it('loads dashboard from repository and stores cache', async () => {
        const cacheService = {
            get: jest.fn().mockResolvedValue(null),
            set: jest.fn(),
        }
        const getDashboardRepository = {
            execute: jest.fn().mockResolvedValue(dashboardPayload),
        }
        const getUserByIdRepository = {
            execute: jest.fn().mockResolvedValue({ id: 'user-1' }),
        }

        const sut = new GetDashboardUseCase(
            getDashboardRepository,
            getUserByIdRepository,
            cacheService,
        )

        const result = await sut.execute('user-1', {})

        expect(result).toEqual(dashboardPayload)
        expect(getDashboardRepository.execute).toHaveBeenCalledWith(
            'user-1',
            {},
        )
        expect(cacheService.set).toHaveBeenCalled()
    })

    it('throws when user does not exist', async () => {
        const getDashboardRepository = { execute: jest.fn() }
        const getUserByIdRepository = {
            execute: jest.fn().mockResolvedValue(null),
        }

        const sut = new GetDashboardUseCase(
            getDashboardRepository,
            getUserByIdRepository,
            null,
        )

        await expect(sut.execute('missing-user', {})).rejects.toBeInstanceOf(
            UserNotFoundError,
        )
    })
})
