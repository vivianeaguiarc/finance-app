// src/repositories/postgres/user/get-user-by-email.js
import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetUserByEmailRepository {
    async execute(email) {
        return await prisma.user.findUnique({
            where: { email: email },
        })
    }
}
