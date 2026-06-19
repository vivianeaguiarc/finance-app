import 'dotenv/config'
import { defineConfig } from 'prisma/config'

function getDatabaseUrl() {
    if (process.env.DATABASE_URL) {
        return process.env.DATABASE_URL
    }

    // prisma generate does not connect; placeholder satisfies config during postinstall/CI
    return 'postgresql://postgres:password@localhost:5432/finance_app'
}

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
    },
    engine: 'classic',
    datasource: {
        url: getDatabaseUrl(),
    },
})
