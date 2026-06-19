import { HealthRepository } from './health.repository.js'
import { HealthService } from './health.service.js'

const healthService = new HealthService(new HealthRepository())

export async function healthHandler(req, res) {
    const { statusCode, body } = await healthService.getHealthPayload()

    return res.status(statusCode).json({
        ...body,
        requestId: req.id,
    })
}

export { HealthService, HealthRepository }
