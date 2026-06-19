import { dashboardQuerySchema } from './dashboard.js'

describe('dashboardQuerySchema', () => {
    it('accepts valid period filters', async () => {
        const parsed = await dashboardQuerySchema.parseAsync({
            startDate: '2025-01-01',
            endDate: '2025-01-31',
            type: 'EXPENSE',
            categoryId: 'Food',
        })

        expect(parsed.type).toBe('EXPENSE')
        expect(parsed.categoryId).toBe('Food')
    })

    it('accepts month and year shortcut', async () => {
        const parsed = await dashboardQuerySchema.parseAsync({
            month: 6,
            year: 2025,
        })

        expect(parsed.month).toBe(6)
        expect(parsed.year).toBe(2025)
    })

    it('rejects mixing period shortcuts with startDate/endDate', async () => {
        await expect(
            dashboardQuerySchema.parseAsync({
                month: 1,
                year: 2025,
                startDate: '2025-01-01',
            }),
        ).rejects.toThrow(/startDate\/endDate or month\/year/)
    })

    it('rejects unknown query params', async () => {
        await expect(
            dashboardQuerySchema.parseAsync({
                userId: '00000000-0000-4000-8000-000000000001',
            }),
        ).rejects.toThrow(/Unrecognized key|Unallowed query parameter/)
    })
})
