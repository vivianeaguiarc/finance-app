import { HealthRepository } from './health.repository.js'
import { HealthService } from './health.service.js'

const healthService = new HealthService(new HealthRepository())

export async function checkDatabaseStatus() {
    const repository = new HealthRepository()
    const status = await repository.ping()
    return status
}

export async function getHealthPayload() {
    return healthService.getHealthPayload()
}
