import validator from 'validator'
import { badRequest, serverError } from './helper.js'
import { UpdateUserUseCase } from '../use-cases/update-user'

export class UpdateUserController{
    async execute(httpRequest){
        try{
            const userId = httpRequest.params.userId
            const isIdValid = validator.isUUID(userId)
            if(!isIdValid){
                return badRequest({
                    message: 'The provider ID is not valid'
                })
            }
            const updateUserParams = httpRequest.body
            const allowedFields = ['first_name', 'last_name', 'email', 'password']
            const someFieldsIsNotAllowed = Object.keys(updateUserParams).some((field) => !allowedFields.includes(field))
            
            if(someFieldsIsNotAllowed){
            return badRequest({
            message: 'Some provided fields is not allowed'
            })
        }
            if(updateUserParams.password){
            const passwordIsNotValid  = updateUserParams.password.length < 6;
            if(passwordIsNotValid){
            return badRequest({
              message: 'Password must be at least 6 characters long'
            })
        }
      }
            if(updateUserParams.email){
            const emailIsValid = validator.isEmail(updateUserParams.email);
            if (!emailIsValid) {
            return badRequest({message: 'Invalid email format. Please provide a valid email address.'})
            }
      }
        const updateUserUseCase = new UpdateUserUseCase()
        const updatedUser = await updateUserUseCase.execute(userId, updateUserParams)
        return ok(updatedUser)
        
    }   catch(error){
            console.error(error)    
            return serverError()
    }
  }
}