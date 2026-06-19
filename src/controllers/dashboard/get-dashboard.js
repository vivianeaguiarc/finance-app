import { dashboardQuerySchema } from '../../schemas/dashboard.js'
import {
    ok,
    userNotFoundResponse,
    mapErrorToHttpResponse,
} from '../helpers/index.js'
import { UserNotFoundError } from '../../errors/index.js'

export class GetDashboardController {
    constructor(getDashboardUseCase) {
        this.getDashboardUseCase = getDashboardUseCase
    }

    async execute(httpRequest) {
        try {
            const userId = httpRequest.userId
            const { userId: _ignoredUserId, ...queryParams } =
                httpRequest.query ?? {}

            const filters = await dashboardQuerySchema.parseAsync(queryParams)

            const dashboard = await this.getDashboardUseCase.execute(
                userId,
                filters,
            )

            return ok(dashboard, 'Dashboard retrieved successfully')
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            return mapErrorToHttpResponse(error, httpRequest)
        }
    }
}
