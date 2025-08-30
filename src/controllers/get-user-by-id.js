import { GetUserByIdUseCase } from "../use-cases/index.js";
import { checkIfIdIsValid, invalidIdResponse, notFoud, ok, serverError } from "./helpers/index.js";

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