import { UserNotFoundError } from '../../errors/user.js'
import { assertCategoryOwnership } from '../../utils/finance-helpers.js'

export class CreateTransactionUseCase {
    constructor(
        createTransactionRepository,
        getUserByIdRepository,
        getCategoryByIdRepository,
        idGeneratorAdapter,
        cacheService = null,
    ) {
        this.createTransactionRepository = createTransactionRepository
        this.getUserByIdRepository = getUserByIdRepository
        this.getCategoryByIdRepository = getCategoryByIdRepository
        this.idGeneratorAdapter = idGeneratorAdapter
        this.cacheService = cacheService
    }
    async execute(createTransactionParams) {
        const userId = createTransactionParams.user_id
        const user = await this.getUserByIdRepository.execute(userId)
        if (!user) {
            throw new UserNotFoundError()
        }

        await assertCategoryOwnership(
            this.getCategoryByIdRepository,
            userId,
            createTransactionParams.categoryId,
        )

        const { categoryId, ...rest } = createTransactionParams
        const transactionId = this.idGeneratorAdapter.execute()
        const transaction = await this.createTransactionRepository.execute({
            ...rest,
            id: transactionId,
            category_id: categoryId ?? null,
        })

        if (this.cacheService) {
            await this.cacheService.invalidateUserCache(userId)
        }

        return transaction
    }
}
