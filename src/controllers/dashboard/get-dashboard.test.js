import { GetDashboardController } from './get-dashboard.js'

describe('GetDashboardController', () => {
    it('returns dashboard for authenticated user only', async () => {
        const dashboard = {
            summary: { balance: '250.00', transactionCount: 2 },
            byCategory: [],
            byMonth: [],
            byType: [],
        }

        const getDashboardUseCase = {
            execute: jest.fn().mockResolvedValue(dashboard),
        }

        const sut = new GetDashboardController(getDashboardUseCase)

        const response = await sut.execute({
            userId: 'user-1',
            query: { type: 'EARNING' },
        })

        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.data).toEqual(dashboard)
        expect(getDashboardUseCase.execute).toHaveBeenCalledWith('user-1', {
            type: 'EARNING',
        })
    })

    it('ignores userId sent via query params', async () => {
        const getDashboardUseCase = {
            execute: jest.fn().mockResolvedValue({
                summary: {},
                byCategory: [],
                byMonth: [],
                byType: [],
            }),
        }

        const sut = new GetDashboardController(getDashboardUseCase)

        await sut.execute({
            userId: 'user-1',
            query: {
                userId: 'other-user',
            },
        })

        expect(getDashboardUseCase.execute).toHaveBeenCalledWith('user-1', {})
    })
})
