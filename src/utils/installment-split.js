import pkg from '@prisma/client'

const { Prisma } = pkg

export function splitInstallmentAmounts(totalAmount, totalInstallments) {
    if (totalInstallments < 2) {
        throw new Error('totalInstallments must be at least 2')
    }

    const total = new Prisma.Decimal(totalAmount)
    const base = total
        .div(totalInstallments)
        .toDecimalPlaces(2, Prisma.Decimal.ROUND_DOWN)
    const amounts = []

    for (let index = 0; index < totalInstallments - 1; index += 1) {
        amounts.push(base)
    }

    const allocated = base.mul(totalInstallments - 1)
    amounts.push(total.minus(allocated))

    return amounts
}

export function addMonthsUtc(date, monthsToAdd) {
    const dateValue = new Date(date)
    const year = dateValue.getUTCFullYear()
    const month = dateValue.getUTCMonth()
    const day = dateValue.getUTCDate()

    return new Date(Date.UTC(year, month + monthsToAdd, day))
}
