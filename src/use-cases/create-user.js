import { v4 as uuidv4 } from 'uuid';  
import bcrypt from 'bcrypt';  
import { PostgresCreateUserRepository } from '../repositories/postgres/create-user';

export class CreateUserUseCase {
    async execute(createUserParams) {
        // verificar se email ja esta em uso
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