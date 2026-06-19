import { z } from 'zod'
import validator from 'validator'

const monthSchema = z.coerce
    .number()
    .int()
    .min(1, { message: 'month must be between 1 and 12' })
    .max(12, { message: 'month must be between 1 and 12' })

const yearSchema = z.coerce
    .number()
    .int()
    .min(1970, { message: 'year must be 1970 or later' })
    .max(2100, { message: 'year must be 2100 or earlier' })

const limitAmountSchema = z
    .number({
        invalid_type_error: 'limitAmount must be a number',
        required_error: 'limitAmount is required',
    })
    .min(0.01, { message: 'limitAmount must be greater than zero' })
    .refine(
        (value) =>
            validator.isCurrency(value.toFixed(2), {
                digits_after_decimal: [2],
                allow_negatives: false,
                decimal_separator: '.',
            }),
        { message: 'limitAmount must be a valid currency value' },
    )

export const createMonthlyBudgetSchema = z.object({
    categoryId: z.string().uuid({ message: 'categoryId must be a valid UUID' }),
    month: monthSchema,
    year: yearSchema,
    limitAmount: limitAmountSchema,
})

export const listBudgetsQuerySchema = z
    .object({
        month: monthSchema.optional(),
        year: yearSchema.optional(),
    })
    .strict({ message: 'Unallowed query parameter' })

export const budgetStatusQuerySchema = z
    .object({
        month: monthSchema,
        year: yearSchema,
    })
    .strict({ message: 'Unallowed query parameter' })
