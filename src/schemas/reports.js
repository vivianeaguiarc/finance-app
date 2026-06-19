import { z } from 'zod'

const dateString = z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), {
        message: 'must be a valid date',
    })

export const financialReportQuerySchema = z
    .object({
        startDate: dateString.optional(),
        endDate: dateString.optional(),
        month: z.coerce
            .number()
            .int()
            .min(1, { message: 'month must be between 1 and 12' })
            .max(12, { message: 'month must be between 1 and 12' })
            .optional(),
        year: z.coerce
            .number()
            .int()
            .min(1970, { message: 'year must be 1970 or later' })
            .max(2100, { message: 'year must be 2100 or earlier' })
            .optional(),
        categoryId: z
            .string()
            .uuid({ message: 'categoryId must be a valid UUID' })
            .optional(),
        type: z.enum(['EXPENSE', 'EARNING', 'INVESTMENT']).optional(),
        format: z.enum(['json', 'csv', 'pdf']).optional(),
    })
    .strict({
        message: 'Unallowed query parameter',
    })
    .superRefine((query, ctx) => {
        if (query.startDate && query.endDate) {
            if (new Date(query.startDate) > new Date(query.endDate)) {
                ctx.addIssue({
                    code: 'custom',
                    message: 'startDate cannot be after endDate',
                    path: ['startDate'],
                })
            }
        }

        const hasPeriodShortcut =
            query.month !== undefined || query.year !== undefined

        if (hasPeriodShortcut && (query.startDate || query.endDate)) {
            ctx.addIssue({
                code: 'custom',
                message:
                    'Use either startDate/endDate or month/year filters, not both',
                path: ['startDate'],
            })
        }
    })
