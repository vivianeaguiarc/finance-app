import {
    serverError,
    checkIfIdIsValid,
    invalidIdResponse,
    userNotFoundResponse,
    noContent, // <--- importar aqui
} from '../helpers/index.js'
import { UserNotFoundError } from '../../errors/user.js'

export class DeleteUserController {
    constructor(deleteUserUseCase) {
        this.deleteUserUseCase = deleteUserUseCase
    }

    async execute(httpRequest) {
        try {
            const userId = httpRequest?.params?.userId
            const isValid = checkIfIdIsValid(userId)

            if (!isValid) {
                return invalidIdResponse()
            }

            const deletedUser = await this.deleteUserUseCase.execute(userId)

            if (deletedUser instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            // 🚀 CORREÇÃO AQUI → retorno correto do DELETE
            return noContent() // 204, body = null
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            console.error(error)
            return serverError()
        }
    }
}
