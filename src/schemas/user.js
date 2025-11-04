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
