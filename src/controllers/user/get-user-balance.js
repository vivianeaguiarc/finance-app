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
            if (error instanceof Error) {
                return userNotFoundResponse()
            }
            console.error(error)
            return serverError()
        }
    }
}
