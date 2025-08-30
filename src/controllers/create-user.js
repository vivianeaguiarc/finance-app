import { CreateUserUseCase } from "../use-cases/create-user.js";
import validator from 'validator';
import { badRequest, serverError, created } from "./helper.js";
import { EmailAlreadyInUseError } from "../erros/user.js";

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
                return badRequest({message: `Missing param: ${field}`})
            }
        }
        // verificar tamanho de senha 
        const passwordIsNotValid = params.password.length >= 6;
        if(!passwordIsNotValid){
            return badRequest({message: 'Password must be at least 6 characters long'})
        }
        // verificar email valido
        const emailIsValid = validator.isEmail(params.email);
        if (!emailIsValid) {
            return badRequest({message: 'Invalid email format. Please provide a valid email address.'})
        }
        // chamar o use case
        const createUseCase = new CreateUserUseCase();
        const createdUser = await createUseCase.execute(params);
        // retorna a resposta para o usuario
        return created(createdUser)
        } catch (error) {
            if(error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message });
            }
            console.error(error);
            return serverError();
        }
    }
}