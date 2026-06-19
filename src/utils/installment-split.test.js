import pkg from '@prisma/client'

const { Prisma } = pkg

import { splitInstallmentAmounts } from './installment-split.js'

describe('splitInstallmentAmounts', () => {
    it('splits 1200 into 12 installments of 100', () => {
        const amounts = splitInstallmentAmounts(1200, 12)

        expect(amounts).toHaveLength(12)
        expect(amounts.every((amount) => amount.toFixed(2) === '100.00')).toBe(
            true,
        )
    })

    it('keeps total amount after split', () => {
        const amounts = splitInstallmentAmounts(1000, 3)
        const total = amounts.reduce(
            (sum, amount) => sum.plus(amount),
            new Prisma.Decimal(0),
        )

        expect(total.toFixed(2)).toBe('1000.00')
    })

    it('throws when installments are less than 2', () => {
        expect(() => splitInstallmentAmounts(100, 1)).toThrow(/at least 2/)
    })
})
