const MAX_RECURRING_OCCURRENCES = 120

export function generateRecurringDates({
    startDate,
    recurrenceType,
    recurrenceEndDate,
    maxOccurrences = MAX_RECURRING_OCCURRENCES,
}) {
    const dates = []
    let current = new Date(startDate)
    const end = recurrenceEndDate ? new Date(recurrenceEndDate) : null

    while (dates.length < maxOccurrences) {
        if (end && current > end) {
            break
        }

        dates.push(new Date(current))

        if (recurrenceType === 'WEEKLY') {
            current = addDaysUtc(current, 7)
        } else if (recurrenceType === 'MONTHLY') {
            current = addMonthsUtc(current, 1)
        } else if (recurrenceType === 'YEARLY') {
            current = addYearsUtc(current, 1)
        } else {
            break
        }
    }

    return dates
}

function addDaysUtc(date, days) {
    const next = new Date(date)
    next.setUTCDate(next.getUTCDate() + days)
    return next
}

function addMonthsUtc(date, months) {
    const year = date.getUTCFullYear()
    const month = date.getUTCMonth()
    const day = date.getUTCDate()
    return new Date(Date.UTC(year, month + months, day))
}

function addYearsUtc(date, years) {
    return addMonthsUtc(date, years * 12)
}
