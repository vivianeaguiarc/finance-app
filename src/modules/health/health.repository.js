import { prisma } from '../../shared/database/index.js'

export class HealthRepository {
    async ping() {
        try {
            await prisma.$queryRaw`SELECT 1`
            return 'connected'
        } catch {
            return 'disconnected'
        }
    }
}
