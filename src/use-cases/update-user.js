import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-email.js'
import { EmailAlreadyInUseError } from '../errors/user.js'
import bcrypt from 'bcryptjs'

export class UpdateUserUseCase {
    async execute(userId, updateUserParams) {
        if (updateUserParams.email) {
            const postgresGetUserByEmailRepository =
                new PostgresGetUserByEmailRepository()

            const userWithProvidedEmail =
                await postgresGetUserByEmailRepository.execute(
                    updateUserParams.email,
                )
            if (userWithProvidedEmail) {
                throw new EmailAlreadyInUseError('Email already in use')
            }
        }
        const user = {
            ...updateUserParams,
        }
        if (updateUserParams.password) {
            const hashedPassword = await bcrypt.hash(
                updateUserParams.password,
                10,
            )
            user.password = hashedPassword
        }
        const PostgresUpdateUserRepository = new PostgresUpdateUserRepository()
        const updatedUser = await PostgresUpdateUserRepository.execute(
            userId,
            user,
        )
        return updatedUser
    }
}
