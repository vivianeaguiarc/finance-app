/**
 * Resolves the database URL used by `prisma migrate deploy`.
 * Neon pooler URLs are converted to direct connections (required for migrations).
 */

/**
 * Converts Neon pooler hostnames to direct (non-pooler) endpoints.
 * Migrations and DDL fail against the pooler with P1000 on Neon.
 */
export function toNeonDirectConnectionUrl(databaseUrl) {
    const url = databaseUrl?.trim()
    if (!url) {
        return url
    }

    if (url.includes('-pooler.')) {
        return url.replace('-pooler.', '.')
    }

    return url
}

export function resolveMigrationDatabaseUrl(databaseUrl, directDatabaseUrl) {
    const url = databaseUrl?.trim()
    if (!url) {
        throw new Error(
            'DATABASE_URL is required for prisma migrate deploy. Configure it in GitHub Secrets (production environment) or .env locally.',
        )
    }

    const candidate = directDatabaseUrl?.trim() || url
    return toNeonDirectConnectionUrl(candidate)
}

/**
 * Returns hostname for safe logging (never includes credentials).
 */
export function getDatabaseHostname(databaseUrl) {
    const url = databaseUrl?.trim()
    if (!url) {
        return '(not set)'
    }

    try {
        const parsed = new URL(url.replace(/^postgres(ql)?:/i, 'http:'))
        return parsed.hostname
    } catch {
        return '(invalid url)'
    }
}

/**
 * Ensures the connection string includes user and password (not a template placeholder).
 */
export function assertDatabaseUrlHasCredentials(databaseUrl) {
    if (!databaseUrl?.trim()) {
        throw new Error(
            'DATABASE_URL is required for prisma migrate deploy. Configure it in GitHub Secrets (production environment) or .env locally.',
        )
    }

    const url = databaseUrl.trim()

    if (/\$\{[^}]+\}/.test(url)) {
        throw new Error(
            'DATABASE_URL contains unresolved placeholders (e.g. ${USER}). Use the full connection string from Neon/Render.',
        )
    }

    if (!/^postgres(ql)?:\/\/[^:\s/]+:[^@\s]+@/i.test(url)) {
        throw new Error(
            'DATABASE_URL must include credentials (postgresql://USER:PASSWORD@HOST/DB). Verify the secret in GitHub → Settings → Environments → production.',
        )
    }
}

export function assertMigrationUsesDirectHost(migrateUrl) {
    const hostname = getDatabaseHostname(migrateUrl)

    if (hostname.includes('-pooler.')) {
        throw new Error(
            `Migration URL still uses Neon pooler host (${hostname}). Use a direct connection string without "-pooler" in the hostname.`,
        )
    }
}
