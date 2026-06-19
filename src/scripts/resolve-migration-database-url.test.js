import {
    assertDatabaseUrlHasCredentials,
    resolveMigrationDatabaseUrl,
} from '../../scripts/resolve-migration-database-url.js'

describe('resolveMigrationDatabaseUrl', () => {
    it('returns explicit DIRECT_DATABASE_URL when set', () => {
        const url = resolveMigrationDatabaseUrl(
            'postgresql://u:p@ep-abc-pooler.us-east-2.aws.neon.tech/neondb',
            'postgresql://u:p@ep-abc.us-east-2.aws.neon.tech/neondb',
        )

        expect(url).toBe(
            'postgresql://u:p@ep-abc.us-east-2.aws.neon.tech/neondb',
        )
    })

    it('derives direct Neon URL from pooler host', () => {
        const url = resolveMigrationDatabaseUrl(
            'postgresql://u:p@ep-cold-river-ae28yxcl-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require',
        )

        expect(url).toBe(
            'postgresql://u:p@ep-cold-river-ae28yxcl.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require',
        )
    })

    it('keeps non-pooler URLs unchanged', () => {
        const local =
            'postgresql://postgres:password@localhost:5432/finance_app_test'
        expect(resolveMigrationDatabaseUrl(local)).toBe(local)
    })

    it('throws when DATABASE_URL is missing', () => {
        expect(() => resolveMigrationDatabaseUrl('')).toThrow(/DATABASE_URL/)
    })
})

describe('assertDatabaseUrlHasCredentials', () => {
    it('accepts a valid postgres URL', () => {
        expect(() =>
            assertDatabaseUrlHasCredentials(
                'postgresql://user:pass@host:5432/db',
            ),
        ).not.toThrow()
    })

    it('rejects unresolved template placeholders', () => {
        expect(() =>
            assertDatabaseUrlHasCredentials(
                'postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@host/db',
            ),
        ).toThrow(/placeholders/)
    })

    it('rejects URLs without credentials', () => {
        expect(() =>
            assertDatabaseUrlHasCredentials('postgresql://host:5432/db'),
        ).toThrow(/credentials/)
    })
})
