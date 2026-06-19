import { UserNotFoundError } from '../../errors/user.js'
import { buildTransactionsCacheKey, CACHE_TTL } from '../../utils/cache-keys.js'

export class GetTransactionByUserIdUseCase {
    constructor(
        getTransactionByUserIdRepository,
        getUserByIdRepository,
        cacheService = null,
    ) {
        this.getTransactionByUserIdRepository = getTransactionByUserIdRepository
        this.getUserByIdRepository = getUserByIdRepository
        this.cacheService = cacheService
    }

    async execute(userId, query) {
        const cacheKey = buildTransactionsCacheKey(userId, query)

        if (this.cacheService) {
            const cached = await this.cacheService.get(cacheKey)
            if (cached) {
                return cached
            }
        }

        const user = await this.getUserByIdRepository.execute(userId)
        if (!user) {
            throw new UserNotFoundError()
        }

        const result = await this.getTransactionByUserIdRepository.execute(
            userId,
            query,
        )

        if (this.cacheService) {
            await this.cacheService.set(
                cacheKey,
                result,
                CACHE_TTL.transactions,
                userId,
            )
        }

        return result
    }
}
