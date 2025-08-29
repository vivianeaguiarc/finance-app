import { GetUserByIdUseCase } from "../use-cases/get-user-by-id.js";
import { notFoud, ok, serverError } from "./helper.js";
import validator from "validator";

export class GetUserByIdController {
    async execute(httpRequest){
      try{
        const isIdValid = validator.isUUID(httpRequest.params.userId);
        if(!isIdValid){
          return badRequest({ error: 'Invalid user ID' });
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