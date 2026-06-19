import { UserNotFoundError } from '../../errors/user.js'
import { buildDashboardCacheKey, CACHE_TTL } from '../../utils/cache-keys.js'

export class GetDashboardUseCase {
    constructor(
        getDashboardRepository,
        getUserByIdRepository,
        cacheService = null,
    ) {
        this.getDashboardRepository = getDashboardRepository
        this.getUserByIdRepository = getUserByIdRepository
        this.cacheService = cacheService
    }

    async execute(userId, filters) {
        const cacheKey = buildDashboardCacheKey(userId, filters)

        if (this.cacheService) {
            const cached = await this.cacheService.get(cacheKey)
            if (cached) {
                return cached
            }
        }

        const user = await this.getUserByIdRepository.execute(userId)
        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const dashboard = await this.getDashboardRepository.execute(
            userId,
            filters,
        )

        if (this.cacheService) {
            await this.cacheService.set(
                cacheKey,
                dashboard,
                CACHE_TTL.dashboard,
                userId,
            )
        }

        return dashboard
    }
}
