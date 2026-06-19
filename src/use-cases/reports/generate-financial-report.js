import { UserNotFoundError } from '../../errors/user.js'
import { assertCategoryOwnership } from '../../utils/finance-helpers.js'

export class GenerateFinancialReportUseCase {
    constructor(
        getFinancialReportRepository,
        getUserByIdRepository,
        getCategoryByIdRepository,
    ) {
        this.getFinancialReportRepository = getFinancialReportRepository
        this.getUserByIdRepository = getUserByIdRepository
        this.getCategoryByIdRepository = getCategoryByIdRepository
    }

    async execute(userId, filters) {
        const user = await this.getUserByIdRepository.execute(userId)
        if (!user) {
            throw new UserNotFoundError()
        }

        await assertCategoryOwnership(
            this.getCategoryByIdRepository,
            userId,
            filters.categoryId,
        )

        return this.getFinancialReportRepository.execute(userId, filters)
    }
}
