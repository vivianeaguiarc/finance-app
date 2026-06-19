/**
 * Resolves the database URL used by `prisma migrate deploy`.
 * Neon pooler URLs are converted to direct connections (required for migrations).
 */
export function resolveMigrationDatabaseUrl(databaseUrl, directDatabaseUrl) {
    const url = databaseUrl?.trim()
    if (!url) {
        throw new Error(
            'DATABASE_URL is required for prisma migrate deploy. Configure it in GitHub Secrets (production environment) or .env locally.',
        )
    }

    const explicitDirect = directDatabaseUrl?.trim()
    if (explicitDirect) {
        return explicitDirect
    }

    if (url.includes('-pooler.')) {
        return url.replace('-pooler.', '.')
    }

    return url
}

/**
 * Ensures the connection string includes user and password (not a template placeholder).
 */
export function assertDatabaseUrlHasCredentials(databaseUrl) {
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
