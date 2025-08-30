// import validator from "validator"
// import { serverError, badRequest, ok } from "./helper.js"
// import { UpdateUserUseCase } from "../use-cases/update-user.js"

// export class UpdateUserController {
//     async execute(httpRequest){
//       try{
//         const userId = httpRequest.params.id
//         const isIdValid = validator.isUUID(httpRequest.params.userId)
//         if(!isIdValid){
//             return badRequest({
//                 message: 'Invalid user ID format. Please provide a valid user ID.'
//             })
//         }
//         const updateUserParams = httpRequest.body
        
//         const allowedFields = ['first_name', 'last_name', 'email', 'password']
//         const someFieldIsNotAllowed = Object.keys(updateUserParams).some(
//             (field) => !allowedFields.includes(field)
//         )
//         if(someFieldIsNotAllowed){
//             return badRequest({
//                 message: 'Some provided field is not allowed'
//             })
//         }
//        if(updateUserParams.password){
//         const passwordIsNotValid = updateUserParams.password.length >= 6
//         if(!passwordIsNotValid){
//             return badRequest({
//                 message: 'Password must be at least 6 characters long'
//             })
//         }
//        }
//       if(updateUserParams.email){
//         const emailIsValid = validator.isEmail(updateUserParams.email)
//         if(!emailIsValid){
//             return badRequest({
//                 message: 'Invalid email format. Please provide a valid email address.'
//             })
//         }
//        }
//         const useCase = new UpdateUserUseCase()
//         const updatedUser = await useCase.execute({
//           userId, updateUserParams
//          })
//          return ok(updatedUser)
//       } catch(error) {
//           console.error(error)
//           return serverError()
//       }
//     }
// }

import validator from "validator";
import { serverError, badRequest, ok } from "./helper.js";
import { UpdateUserUseCase } from "../use-cases/update-user.js";

export class UpdateUserController {
  async execute(httpRequest){
    try{
      // aceita :userId (preferência) ou :id, conforme sua rota
      const id = httpRequest.params?.userId ?? httpRequest.params?.id;

      if (typeof id !== 'string' || id.trim().length === 0) {
        return badRequest({ message: 'Missing param: id' });
      }

      const isIdValid = validator.isUUID(id);
      if(!isIdValid){
        return badRequest({
          message: 'Invalid user ID format. Please provide a valid user ID.'
        });
      }

      const updateUserParams = httpRequest.body ?? {};
      const allowedFields = ['first_name', 'last_name', 'email', 'password'];

      const someFieldIsNotAllowed = Object.keys(updateUserParams)
        .some((field) => !allowedFields.includes(field));
      if (someFieldIsNotAllowed){
        return badRequest({ message: 'Some provided field is not allowed' });
      }

      // senha inválida quando for menor que 6
      if (updateUserParams.password && updateUserParams.password.length < 6){
        return badRequest({ message: 'Password must be at least 6 characters long' });
      }

      if (updateUserParams.email){
        const emailIsValid = validator.isEmail(updateUserParams.email);
        if(!emailIsValid){
          return badRequest({ message: 'Invalid email format. Please provide a valid email address.' });
        }
      }

      const useCase = new UpdateUserUseCase();
      // >>> passe os DOIS argumentos, não um objeto
      const updatedUser = await useCase.execute(id, updateUserParams);

      // opcional: tratar quando nada foi atualizado
      if (!updatedUser) {
        return badRequest({ message: 'User not found or nothing to update' });
      }

      return ok(updatedUser);
    } catch(error) {
      console.error(error);
      return serverError();
    }
  }
}
