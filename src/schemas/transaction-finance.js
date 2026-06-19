import { z } from 'zod'
import validator from 'validator'

const transactionBaseSchema = z.object({
    name: z.string().trim().min(1, { message: 'Name is required' }),
    date: z
        .string()
        .datetime({ message: 'Date must be a valid datetime string' }),
    type: z.enum(['EXPENSE', 'EARNING', 'INVESTMENT'], {
        errorMap: () => ({
            message: 'Type must be EXPENSE, EARNING, or INVESTMENT',
        }),
    }),
    categoryId: z
        .string()
        .uuid({ message: 'categoryId must be a valid UUID' })
        .optional(),
})

const amountSchema = z
    .number({
        invalid_type_error: 'Amount must be a number',
        required_error: 'Amount is required',
    })
    .min(0.01, { message: 'Amount must be greater than zero' })
    .refine(
        (value) =>
            validator.isCurrency(value.toFixed(2), {
                digits_after_decimal: [2],
                allow_negatives: false,
                decimal_separator: '.',
            }),
        { message: 'Amount must be a valid currency value' },
    )

export const createInstallmentTransactionSchema = transactionBaseSchema
    .extend({
        totalAmount: amountSchema,
        totalInstallments: z.coerce
            .number()
            .int()
            .min(2, { message: 'totalInstallments must be greater than 1' })
            .max(120, { message: 'totalInstallments must be at most 120' }),
    })
    .strict({ message: 'Unallowed field in installment transaction' })

export const createRecurringTransactionSchema = transactionBaseSchema
    .extend({
        amount: amountSchema,
        isRecurring: z.literal(true),
        recurrenceType: z.enum(['WEEKLY', 'MONTHLY', 'YEARLY'], {
            errorMap: () => ({
                message: 'recurrenceType must be WEEKLY, MONTHLY or YEARLY',
            }),
        }),
        recurrenceEndDate: z
            .string()
            .datetime({ message: 'recurrenceEndDate must be a valid datetime' })
            .optional(),
    })
    .strict({ message: 'Unallowed field in recurring transaction' })
    .superRefine((data, ctx) => {
        if (data.recurrenceEndDate) {
            const start = new Date(data.date)
            const end = new Date(data.recurrenceEndDate)

            if (end < start) {
                ctx.addIssue({
                    code: 'custom',
                    message:
                        'recurrenceEndDate cannot be before the start date',
                    path: ['recurrenceEndDate'],
                })
            }
        }
    })
