import { z } from 'zod'
import validator from 'validator'

export const createdTransactionSchema = z.object({
    user_id: z.string().uuid({ message: 'User ID must be a valid UUID' }),

    name: z.string().trim().min(1, {
        message: 'Name is required',
    }),

    date: z
        .string()
        .datetime({ message: 'Date must be a valid datetime string' }),

    type: z.enum(['EXPENSE', 'EARNING', 'INVESTMENT'], {
        errorMap: () => ({
            message: 'Type must be EXPENSE, EARNING, or INVESTMENT',
        }),
    }),

    amount: z
        .number({
            invalid_type_error: 'Amount must be a number',
            required_error: 'Amount is required',
        })
        .min(1, { message: 'Amount must be greater than zero' })
        .refine(
            (value) =>
                validator.isCurrency(value.toFixed(2), {
                    digits_after_decimal: [2],
                    allow_negatives: false,
                    decimal_separator: '.',
                }),
            {
                message: 'Amount must be a valid currency value',
            },
        ),
})

export const updateTransactionSchema = createdTransactionSchema
    .omit({ user_id: true })
    .partial()
    .strict({
        message: 'Unallowed field(s) in the transaction update',
    })

export const getTransactionsByUserIdSchema = z.object({
    userId: z.string().uuid(),
    from: z.string().optional(),
    to: z.string().optional(),
})
