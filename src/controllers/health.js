import { prisma } from '../../prisma/prisma.js'

export async function checkDatabaseStatus() {
    try {
        await prisma.$queryRaw`SELECT 1`
        return 'connected'
    } catch {
        return 'disconnected'
    }
}

export async function getHealthPayload() {
    const timestamp = new Date().toISOString()
    const uptime = Math.floor(process.uptime())
    const environment = process.env.NODE_ENV || 'development'
    const databaseStatus = await checkDatabaseStatus()
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
