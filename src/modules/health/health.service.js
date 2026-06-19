export class HealthService {
    constructor(healthRepository) {
        this.healthRepository = healthRepository
    }

    async getHealthPayload() {
        const timestamp = new Date().toISOString()
        const uptime = Math.floor(process.uptime())
        const environment = process.env.NODE_ENV || 'development'
        const databaseStatus = await this.healthRepository.ping()
        const isHealthy = databaseStatus === 'connected'

        return {
            statusCode: isHealthy ? 200 : 503,
            body: {
                success: isHealthy,
                message: isHealthy
                    ? 'Service is healthy'
                    : 'Service degraded — database unavailable',
                data: {
                    status: isHealthy ? 'ok' : 'degraded',
                    environment,
                    uptime,
                    timestamp,
                    database: {
                        status: databaseStatus,
                    },
                    docs: '/docs',
                },
            },
        }
    }
}
