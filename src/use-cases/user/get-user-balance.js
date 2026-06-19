import { UserNotFoundError } from '../../errors/user.js'
import { buildBalanceCacheKey, CACHE_TTL } from '../../utils/cache-keys.js'

export class GetUserBalanceUseCase {
    constructor(
        getUserBalanceRepository,
        getUserByIdRepository,
        cacheService = null,
    ) {
        this.getUserBalanceRepository = getUserBalanceRepository
        this.getUserByIdRepository = getUserByIdRepository
        this.cacheService = cacheService
    }
    async execute(userId, from, to) {
        const cacheKey = buildBalanceCacheKey(userId, from, to)

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
        const balance = await this.getUserBalanceRepository.execute(
            userId,
            from,
            to,
        )

        if (this.cacheService) {
            await this.cacheService.set(
                cacheKey,
                balance,
                CACHE_TTL.balance,
                userId,
            )
        }

        return balance
    }
}
