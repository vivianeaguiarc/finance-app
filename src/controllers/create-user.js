import { CreateUserUseCase } from "../use-cases/create-user.js";
import validator from 'validator';

export class CreateUserController {
    async execute(httpRequest) {
        try{
                 const params = httpRequest.body;
        // validar a requisição (campos obrigatorios e tamanho de senha)
        const requiredFields = [
            'first_name', 
            'last_name', 
            'email', 
            'password'
        ];
        for (const field of requiredFields) {
            if (!params[field] || params[field].trim().length === 0) {
                return {
                    statusCode: 400,
                    body: {
                        errorMessage: `Missing param: ${field}`
                    }
                };
            }
        }
        // verificar tamanho de senha 
        const passwordIsValid = params.password.length >= 6;
        if(!passwordIsValid){
            return {
                statusCode: 400,
                body: {
                    errorMessage: 'Password must be at least 6 characters long'
                }
            };
        }
        // verificar email valido
        const emailIsValid = validator.isEmail(params.email);
        if (!emailIsValid) {
            return {
                statusCode: 400,
                body: {
                    errorMessage: 'Invalid email format. Please provide a valid email address.'
                }
            };
        }
        // chamar o use case
        const createUseCase = new CreateUserUseCase();
        const createdUser = await createUseCase.execute(params);
        // retorna a resposta para o usuario
        return {
            statusCode: 201,
            body: createdUser
        };
        } catch (error) {
            console.error(error);
            return {
                statusCode: 500,
                body: {
                    errorMessage: 'Internal server error'
                }
            };
        }
    }
}