import { calculateBudgetStatus } from './budget-status.js'

describe('calculateBudgetStatus', () => {
    it('returns safe below 80%', () => {
        expect(calculateBudgetStatus(1000, 500)).toEqual({
            limitAmount: '1000.00',
            spentAmount: '500.00',
            usedPercentage: 50,
            status: 'safe',
        })
    })

    it('returns warning between 80% and 100%', () => {
        const result = calculateBudgetStatus(1000, 850)

        expect(result.status).toBe('warning')
        expect(result.usedPercentage).toBe(85)
    })

    it('returns exceeded above 100%', () => {
        const result = calculateBudgetStatus(1000, 1200)

        expect(result.status).toBe('exceeded')
        expect(result.usedPercentage).toBe(120)
    })
})
