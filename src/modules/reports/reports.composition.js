import { GenerateFinancialReportController } from '../../controllers/reports/generate-financial-report.js'
import { GenerateFinancialReportUseCase } from '../../use-cases/reports/generate-financial-report.js'
import { PostgresGetFinancialReportRepository } from '../../repositories/postgres/reports/get-financial-report.js'
import { PostgresGetUserByIdRepository } from '../../repositories/postgres/user/get-user-by-id.js'
import { PostgresGetCategoryByIdRepository } from '../../repositories/postgres/category/get-category-by-id.js'

export const makeGenerateFinancialReportController = () => {
    const getFinancialReportRepository =
        new PostgresGetFinancialReportRepository()
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const getCategoryByIdRepository = new PostgresGetCategoryByIdRepository()
    const generateFinancialReportUseCase = new GenerateFinancialReportUseCase(
        getFinancialReportRepository,
        getUserByIdRepository,
        getCategoryByIdRepository,
    )

    return new GenerateFinancialReportController(generateFinancialReportUseCase)
}
