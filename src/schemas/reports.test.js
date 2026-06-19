import { financialReportQuerySchema } from './reports.js'

describe('financialReportQuerySchema', () => {
    it('should accept json format by default', async () => {
        const parsed = await financialReportQuerySchema.parseAsync({})

        expect(parsed.format).toBeUndefined()
    })

    it('should accept supported export formats', async () => {
        await expect(
            financialReportQuerySchema.parseAsync({ format: 'csv' }),
        ).resolves.toMatchObject({ format: 'csv' })

        await expect(
            financialReportQuerySchema.parseAsync({ format: 'pdf' }),
        ).resolves.toMatchObject({ format: 'pdf' })
    })

    it('should reject invalid format', async () => {
        await expect(
            financialReportQuerySchema.parseAsync({ format: 'xml' }),
        ).rejects.toThrow()
    })

    it('should reject mixed period filters', async () => {
        await expect(
            financialReportQuerySchema.parseAsync({
                startDate: '2025-06-01T00:00:00.000Z',
                month: 6,
            }),
        ).rejects.toThrow()
    })
})
