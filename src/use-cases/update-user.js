import bcrypt from "bcrypt"
import {PostgresGetUserByEmailRepository} from "../repositories/postgres/get-user-by-email-repository.js"
import {EmailAlreadyInUseError} from "../errors/user.js"
import { PostgresUpdateUserRepository } from "../repositories/postgres/update-user"

export class UpdateUserUseCase {
    async execute(userId, updateUserParams) {
        // se o email estiver sendo atualizado, verificar se ele já esta em uso
        if(updateUserParams.email){
            const postgresGetUserByEmailRepository = new PostgresGetUserByEmailRepository()

            const userWithProviderEmail = await postgresGetUserByEmailRepository.execute(
                updateUserParams.email
            )
            if(userWithProviderEmail){
                throw new EmailAlreadyInUseError(updateUserParams.email)
            }


        // se a senha estiver sendo atualizada, criptografa-la
        const user = {
            ...updateUserParams
        }
        if(updateUserParams.password){
            const hashedPassword = await bcrypt.hash(updateUserParams.password, 10)
            user.password = hashedPassword
        }

        // chama o repositório para atualizar o usuário
        const postgresUpdateUserRepository = new PostgresUpdateUserRepository()
        const updateUser = await postgresUpdateUserRepository.execute(
            userId, user
        )
        return updateUser
        }
    }
}