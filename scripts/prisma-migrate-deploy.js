import { execSync } from 'node:child_process'
import {
    assertDatabaseUrlHasCredentials,
    resolveMigrationDatabaseUrl,
} from './resolve-migration-database-url.js'

const databaseUrl = process.env.DATABASE_URL
const directDatabaseUrl = process.env.DIRECT_DATABASE_URL

assertDatabaseUrlHasCredentials(databaseUrl)

const migrateUrl = resolveMigrationDatabaseUrl(databaseUrl, directDatabaseUrl)

if (migrateUrl !== databaseUrl.trim()) {
    console.log(
        'Using Neon direct connection URL for prisma migrate deploy (pooler host converted).',
    )
}

execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: {
        ...process.env,
        DATABASE_URL: migrateUrl,
        DIRECT_DATABASE_URL: migrateUrl,
    },
})
