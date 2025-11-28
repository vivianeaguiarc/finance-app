import { z } from 'zod'

export const createdUserSchema = z.object({
    first_name: z.string().trim().min(1, { message: 'First name is required' }),
    last_name: z.string().trim().min(1, { message: 'Last name is required' }),
    email: z
        .string()
        .email({ message: 'Please provide a valid e-mail.' })
        .trim(),
    password: z.string().trim().min(6, {
        message: 'Password must be at least 6 characters long',
    }),
})
export const updatedUserSchema = createdUserSchema.partial().strict({
    message: 'Some fields are not allowed to be updated',
})
export const loginSchema = z.object({
    email: z
        .string()
        .email({ message: 'Please provide a valid e-mail.' })
        .trim()
        .min(1, { message: 'Email is required' }),
    password: z
        .string()
        .trim()
        .min(6, { message: 'Password must be at least 6 characters long' }),
})
export const refreshTokenSchema = z.object({
    refreshToken: z
        .string()
        .trim()
        .min(1, { message: 'Refresh token is required' }),
})
export const getUserBalanceSchema = z.object({
    userId: z.string().uuid({ message: 'Invalid user ID' }),
    from: z.string().min(1, 'from is required'),
    to: z.string().min(1, 'to is required'),
})
