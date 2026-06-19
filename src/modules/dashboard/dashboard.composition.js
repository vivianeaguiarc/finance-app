import { GetDashboardController } from './dashboard.controller.js'
import { GetDashboardUseCase } from './dashboard.service.js'
import { PostgresGetDashboardRepository } from './dashboard.repository.js'
import { PostgresGetUserByIdRepository } from '../../repositories/postgres/user/get-user-by-id.js'
import { getCacheService } from '../../adapters/cache-service.js'

export const makeGetDashboardController = () => {
    const cacheService = getCacheService()
    const getDashboardRepository = new PostgresGetDashboardRepository()
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const getDashboardUseCase = new GetDashboardUseCase(
        getDashboardRepository,
        getUserByIdRepository,
        cacheService,
    )

    return new GetDashboardController(getDashboardUseCase)
}
