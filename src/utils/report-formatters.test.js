import {
    buildFinancialReportCsv,
    buildFinancialReportPdf,
} from './report-formatters.js'

const sampleReport = {
    period: {
        startDate: '2025-06-01T00:00:00.000Z',
        endDate: '2025-06-30T23:59:59.999Z',
        month: 6,
        year: 2025,
    },
    summary: {
        totalEarnings: '1000.00',
        totalExpenses: '200.00',
        totalInvestments: '0.00',
        balance: '800.00',
        transactionCount: 2,
    },
    transactions: [
        {
            name: 'Salary',
            date: '2025-06-10T00:00:00.000Z',
            type: 'EARNING',
            amount: '1000.00',
            categoryName: 'Salary',
        },
        {
            name: 'Food',
            date: '2025-06-12T00:00:00.000Z',
            type: 'EXPENSE',
            amount: '200.00',
            categoryName: 'Food',
        },
    ],
    byCategory: [
        {
            categoryName: 'Food',
            type: 'EXPENSE',
            totalAmount: '200.00',
            count: 1,
        },
    ],
    byType: [
        {
            type: 'EARNING',
            totalAmount: '1000.00',
            count: 1,
        },
        {
            type: 'EXPENSE',
            totalAmount: '200.00',
            count: 1,
        },
    ],
    meta: {
        truncated: false,
        transactionLimit: 5000,
        exportedCount: 2,
    },
}

describe('report formatters', () => {
    it('should build CSV with UTF-8 BOM and headers', () => {
        const csv = buildFinancialReportCsv(sampleReport)

        expect(csv.startsWith('\uFEFF')).toBe(true)
        expect(csv).toContain('Date,Name,Type,Amount,Category')
        expect(csv).toContain('Summary By Category')
        expect(csv).not.toContain('user_id')
    })

    it('should build PDF buffer', async () => {
        const pdf = await buildFinancialReportPdf(sampleReport)

        expect(Buffer.isBuffer(pdf)).toBe(true)
        expect(pdf.slice(0, 4).toString()).toBe('%PDF')
    })
})
