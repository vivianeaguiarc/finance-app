import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    userNotFoundResponse,
} from '../helpers/index.js'

export class GetUserBalanceController {
    constructor(getUserBalanceUseCase) {
        this.getUserBalanceUseCase = getUserBalanceUseCase
    }
    async execute(httpRequest) {
        try {
            const userid = httpRequest.params.userId
            const idIsValid = checkIfIdIsValid(userid)
            if (!idIsValid) {
                return invalidIdResponse()
            }
            const userBalance = await this.getUserBalanceUseCase.execute({
                userId: userid,
            })
            return ok(userBalance)
        } catch (error) {
            // Se o caso de uso retornou null, o controller pode lançar manualmente um erro específico
            if (error && error.name === 'UserNotFoundError') {
                return userNotFoundResponse() // 404
            }

            console.error(error)
            return serverError() // 500 para qualquer outro erro genérico
        }
    }
}
