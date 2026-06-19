import { generateRecurringDates } from './recurring-dates.js'

describe('generateRecurringDates', () => {
    it('generates monthly dates until end date', () => {
        const dates = generateRecurringDates({
            startDate: '2025-01-01T00:00:00.000Z',
            recurrenceType: 'MONTHLY',
            recurrenceEndDate: '2025-03-01T00:00:00.000Z',
        })

        expect(dates).toHaveLength(3)
    })

    it('rejects invalid recurrence through empty result guard in use case', () => {
        const dates = generateRecurringDates({
            startDate: '2025-06-01T00:00:00.000Z',
            recurrenceType: 'MONTHLY',
            recurrenceEndDate: '2025-01-01T00:00:00.000Z',
        })

        expect(dates).toHaveLength(0)
    })
})
