import { UserNotFoundError } from '../../errors/user.js'
import { assertCategoryOwnership } from '../../utils/finance-helpers.js'

export class CreateCategoryUseCase {
    constructor(
        createCategoryRepository,
        getUserByIdRepository,
        idGeneratorAdapter,
    ) {
        this.createCategoryRepository = createCategoryRepository
        this.getUserByIdRepository = getUserByIdRepository
        this.idGeneratorAdapter = idGeneratorAdapter
    }

    async execute(userId, name) {
        const user = await this.getUserByIdRepository.execute(userId)
        if (!user) {
            throw new UserNotFoundError()
        }

        return this.createCategoryRepository.execute({
            id: this.idGeneratorAdapter.execute(),
            userId,
            name,
        })
    }
}

export class ListCategoriesUseCase {
    constructor(listCategoriesRepository, getUserByIdRepository) {
        this.listCategoriesRepository = listCategoriesRepository
        this.getUserByIdRepository = getUserByIdRepository
    }

    async execute(userId) {
        const user = await this.getUserByIdRepository.execute(userId)
        if (!user) {
            throw new UserNotFoundError()
        }

        return this.listCategoriesRepository.execute(userId)
    }
}

export { assertCategoryOwnership }
