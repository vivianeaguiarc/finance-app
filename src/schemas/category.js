import { z } from 'zod'

export const createCategorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, { message: 'Category name is required' })
        .max(50, { message: 'Category name must be at most 50 characters' }),
})

export const categoryIdParamSchema = z.object({
    categoryId: z.string().uuid({ message: 'categoryId must be a valid UUID' }),
})
