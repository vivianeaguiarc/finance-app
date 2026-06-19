import { prisma } from '../../../prisma/prisma.js'

const TEST_DATABASE_PATTERN = /finance_app_test|_test\b/i

const FORBIDDEN_DATABASE_PATTERNS = [
    /neon\.tech/i,
    /render\.com/i,
    /supabase/i,
    /amazonaws\.com/i,
]

export function assertTestDatabase() {
    if (process.env.NODE_ENV !== 'test') {
        throw new Error('Integration tests must run with NODE_ENV=test')
    }

    const databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl) {
        throw new Error(
            'DATABASE_URL is required for integration tests. Use .env.test or CI env vars.',
        )
    }

    if (!TEST_DATABASE_PATTERN.test(databaseUrl)) {
        throw new Error(
            `Refusing to run integration tests: DATABASE_URL must point to a test database (expected name containing "finance_app_test" or "_test").`,
        )
    }

    for (const pattern of FORBIDDEN_DATABASE_PATTERNS) {
        if (pattern.test(databaseUrl)) {
            throw new Error(
                'Refusing to run integration tests against a remote/production database.',
            )
        }
    }
}

export async function ensureDatabaseReady() {
    assertTestDatabase()

    try {
        await prisma.$queryRaw`SELECT 1`
    } catch (error) {
        const databaseUrl = process.env.DATABASE_URL ?? ''
        const host = databaseUrl.match(/@([^/?]+)/)?.[1] ?? 'database'

        throw new Error(
            `Integration tests cannot reach PostgreSQL at ${host}. ` +
                'Start Docker Desktop, then run: npm run docker:test:up && npm run migrations:test',
            { cause: error },
        )
    }
}

export async function resetDatabase() {
    await prisma.transaction.deleteMany()
    await prisma.refreshTokenSession.deleteMany()
    await prisma.user.deleteMany()
}

export async function disconnectDatabase() {
    await prisma.$disconnect()
}
