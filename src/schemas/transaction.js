import { z } from 'zod'
import validator from 'validator'

export const DEFAULT_PAGE = 1
export const DEFAULT_LIMIT = 10
export const MAX_LIMIT = 100

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

export const listTransactionsQuerySchema = z
    .object({
        userId: z.string().uuid({ message: 'userId must be a valid UUID' }),
        page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
        limit: z.coerce
            .number()
            .int()
            .min(1)
            .max(MAX_LIMIT, {
                message: `limit must be at most ${MAX_LIMIT}`,
            })
            .default(DEFAULT_LIMIT),
        type: z.enum(['EXPENSE', 'EARNING', 'INVESTMENT']).optional(),
        startDate: z
            .string()
            .refine((value) => !Number.isNaN(Date.parse(value)), {
                message: 'startDate must be a valid date',
            })
            .optional(),
        endDate: z
            .string()
            .refine((value) => !Number.isNaN(Date.parse(value)), {
                message: 'endDate must be a valid date',
            })
            .optional(),
        from: z
            .string()
            .refine((value) => !Number.isNaN(Date.parse(value)), {
                message: 'from must be a valid date',
            })
            .optional(),
        to: z
            .string()
            .refine((value) => !Number.isNaN(Date.parse(value)), {
                message: 'to must be a valid date',
            })
            .optional(),
        minAmount: z.coerce.number().min(0).optional(),
        maxAmount: z.coerce.number().min(0).optional(),
        sortBy: z.enum(['date', 'amount', 'createdAt']).default('date'),
        sortOrder: z.enum(['asc', 'desc']).default('desc'),
    })
    .strict({
        message: 'Unallowed query parameter',
    })
    .transform((query) => {
        const startDate = query.startDate ?? query.from
        const endDate = query.endDate ?? query.to
        const { from, to, ...rest } = query

        return {
            ...rest,
            startDate,
            endDate,
        }
    })
    .superRefine((query, ctx) => {
        if (
            query.minAmount !== undefined &&
            query.maxAmount !== undefined &&
            query.minAmount > query.maxAmount
        ) {
            ctx.addIssue({
                code: 'custom',
                message: 'minAmount cannot be greater than maxAmount',
                path: ['minAmount'],
            })
        }
    })
