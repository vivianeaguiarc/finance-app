import pkg from '@prisma/client'

const { Prisma } = pkg

export const BUDGET_WARNING_THRESHOLD = 80

export function calculateBudgetStatus(limitAmount, spentAmount) {
    const limit = new Prisma.Decimal(limitAmount)
    const spent = new Prisma.Decimal(spentAmount)

    if (limit.isZero()) {
        return {
            limitAmount: limit.toFixed(2),
            spentAmount: spent.toFixed(2),
            usedPercentage: 0,
            status: 'safe',
        }
    }

    const usedPercentage = spent.div(limit).mul(100).toNumber()
    let status = 'safe'

    if (usedPercentage > 100) {
        status = 'exceeded'
    } else if (usedPercentage >= BUDGET_WARNING_THRESHOLD) {
        status = 'warning'
    }

    return {
        limitAmount: limit.toFixed(2),
        spentAmount: spent.toFixed(2),
        usedPercentage: Math.round(usedPercentage * 100) / 100,
        status,
    }
}
