import { HealthService } from './health.service.js'

describe('HealthService', () => {
    it('returns healthy payload when database is connected', async () => {
        const healthRepository = {
            ping: jest.fn().mockResolvedValue('connected'),
        }
        const service = new HealthService(healthRepository)

        const result = await service.getHealthPayload()

        expect(result.statusCode).toBe(200)
        expect(result.body.success).toBe(true)
        expect(result.body.data.database.status).toBe('connected')
        expect(healthRepository.ping).toHaveBeenCalledTimes(1)
    })

    it('returns degraded payload when database is disconnected', async () => {
        const healthRepository = {
            ping: jest.fn().mockResolvedValue('disconnected'),
        }
        const service = new HealthService(healthRepository)

        const result = await service.getHealthPayload()

        expect(result.statusCode).toBe(503)
        expect(result.body.success).toBe(false)
        expect(result.body.data.status).toBe('degraded')
    })
})
