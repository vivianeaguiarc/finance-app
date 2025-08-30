import { GetUserByIdUseCase } from "../use-cases/get-user-by-id.js";
import { notFoud, ok, serverError } from "./helpers/http.js";
import { checkIfIdIsValid, invalidIdResponse } from "./helpers/user.js";

export class GetUserByIdController {
    async execute(httpRequest){
      try{
        const isIdValid = checkIfIdIsValid(httpRequest.params.userId);
        if(!isIdValid){
          return invalidIdResponse()
        }
        const getUserByIdController = new GetUserByIdUseCase();
        const user = await getUserByIdController.execute(httpRequest.params.userId);
        if(!user){
          return notFoud({ message: 'User not found' });
        }
        return ok(user);
      } catch(error){
        console.error(error)
        return serverError()
      }
    }
}