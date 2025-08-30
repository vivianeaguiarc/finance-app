import bcrypt from "bcrypt";
import { PostgresGetUserByEmailRepository } from "../repositories/postgres/get-user-by-email.js";
import { EmailAlreadyInUseError } from "../errors/user.js";
import { PostgresUpdateUserRepository } from "../repositories/postgres/update-user.js";

export class UpdateUserCase {
    async execute(userId, updateUserParams){
        // se o e-mail estiver sendo atualizado, verificar se ele ja está em uso
        if(updateUserParams.email){
            const postgresGetUserByEmailRepository = new PostgresGetUserByEmailRepository()
            const userWithProviderEmail = await postgresGetUserByEmailRepository.execute(updateUserParams.email)
            if(userWithProviderEmail){
                throw new EmailAlreadyInUseError(updateUserParams.email)
            }
        }
        const user = {
            ...updateUserParams
        }
        // se a senha estiver sendo atualizada criptografa-la
        if(updateUserParams.password){
            const hashedPassword = await bcrypt.hash(updateUserParams.password, 10)
            user.password = hashedPassword
        }
        // chamar o repository para atualizar o usuário
        const postgresUpdateUserRepository = new PostgresUpdateUserRepository()
        const updatedUser = await postgresUpdateUserRepository.execute(
            userId,
            user,
        )
        return updatedUser
    }
}