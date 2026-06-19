import { execSync } from 'node:child_process'
import {
    assertDatabaseUrlHasCredentials,
    assertMigrationUsesDirectHost,
    getDatabaseHostname,
    resolveMigrationDatabaseUrl,
    toNeonDirectConnectionUrl,
} from './resolve-migration-database-url.js'

const databaseUrl = process.env.DATABASE_URL
const directDatabaseUrl = process.env.DIRECT_DATABASE_URL

assertDatabaseUrlHasCredentials(databaseUrl)

const migrateUrl = resolveMigrationDatabaseUrl(databaseUrl, directDatabaseUrl)
assertMigrationUsesDirectHost(migrateUrl)

const sourceHost = getDatabaseHostname(directDatabaseUrl?.trim() || databaseUrl)
const migrateHost = getDatabaseHostname(migrateUrl)

console.log(`Prisma migrate deploy target host: ${migrateHost}`)

if (sourceHost.includes('-pooler.')) {
    console.log(
        'Neon pooler host detected; using direct connection for migrate deploy.',
    )
}

if (
    directDatabaseUrl?.trim() &&
    toNeonDirectConnectionUrl(directDatabaseUrl) !== directDatabaseUrl.trim()
) {
    console.log(
        'DIRECT_DATABASE_URL pointed to Neon pooler; converted to direct host automatically.',
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
