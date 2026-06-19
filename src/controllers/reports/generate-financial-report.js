import { financialReportQuerySchema } from '../../schemas/reports.js'
import {
    fileDownload,
    mapErrorToHttpResponse,
    ok,
    userNotFoundResponse,
} from '../helpers/index.js'
import {
    CategoryForbiddenError,
    CategoryNotFoundError,
    UserNotFoundError,
} from '../../errors/index.js'
import {
    buildFinancialReportCsv,
    buildFinancialReportPdf,
} from '../../utils/report-formatters.js'

export class GenerateFinancialReportController {
    constructor(generateFinancialReportUseCase) {
        this.generateFinancialReportUseCase = generateFinancialReportUseCase
    }

    async execute(httpRequest) {
        try {
            const userId = httpRequest.userId
            const { userId: _ignoredUserId, ...queryParams } =
                httpRequest.query ?? {}

            const filters =
                await financialReportQuerySchema.parseAsync(queryParams)
            const format = filters.format ?? 'json'

            const report = await this.generateFinancialReportUseCase.execute(
                userId,
                filters,
            )

            if (format === 'csv') {
                return fileDownload(
                    buildFinancialReportCsv(report),
                    'text/csv; charset=utf-8',
                    'financial-report.csv',
                )
            }

            if (format === 'pdf') {
                const pdfBuffer = await buildFinancialReportPdf(report)
                return fileDownload(
                    pdfBuffer,
                    'application/pdf',
                    'financial-report.pdf',
                )
            }

            return ok(report, 'Financial report generated successfully')
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            if (
                error instanceof CategoryNotFoundError ||
                error instanceof CategoryForbiddenError
            ) {
                return mapErrorToHttpResponse(error, httpRequest)
            }

            return mapErrorToHttpResponse(error, httpRequest)
        }
    }
}
