// src/use-cases/create-user.js
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import {
  PostgresCreateUserRepository,
  PostgresGetUserByEmailRepository,
} from '../repositories/postgres/index.js';
import { EmailAlreadyInUseError } from '../errors/user.js';

// ...classe CreateUserUseCase

export class CreateUserUseCase {
    async execute(createUserParams) {
        // verificar se email ja esta em uso
        const postgresGetUserByEmailRepository = new PostgresGetUserByEmailRepository();

        const userWithProviderEmail = await postgresGetUserByEmailRepository.execute(createUserParams.email);
        if (userWithProviderEmail) {
            throw new EmailAlreadyInUseError(createUserParams.email);
        }
        // gerar id do usuario
        const userId = uuidv4();
        // criptografar a senha
        const hashedPassword = await bcrypt.hash(createUserParams.password, 10);
        // inserior o usuario no banco de dados
        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword
        };
        // chamar o repositorio
        const postgresCreateUserRepository = new PostgresCreateUserRepository();
        const createdUser = await postgresCreateUserRepository.execute(user);
        return createdUser;
    }
}