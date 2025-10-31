import {
    badRequest,
    checkIfAmountIsValid,
    checkIfIdIsValid,
    checkIfTypeIsValid,
    invalidAmountResponse,
    invalidIdResponse,
    invalidTypeResponse,
    ok,
    serverError,
} from '../helpers/index.js'

export class UpdateTransactionController {
    constructor(updateTransactionUseCase) {
        this.updateTransactionUseCase = updateTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const idIsValid = checkIfIdIsValid(httpRequest.params.transactionId)
            if (!idIsValid) {
                return invalidIdResponse()
            }
            const params = httpRequest.body
            const allowedFields = ['name', 'date', 'amount', 'type']
            const someFieldIsAllowed = Object.keys(params).some(
                (field) => !allowedFields.includes(field),
            )
            if (someFieldIsAllowed) {
                return badRequest({
                    message: 'Some fields are not allowed to be updated.',
                })
            }
            if (params.amount) {
                const amountIsValid = checkIfAmountIsValid(params.amount)
                if (!amountIsValid) {
                    return invalidAmountResponse()
                }
            }
            if (params.type) {
                const typeIsValid = checkIfTypeIsValid(params.type)
                if (!typeIsValid) {
                    return invalidTypeResponse()
                }
            }
            const transaction = await this.updateTransactionUseCase.execute(
                httpRequest.params.transactionId,
                params,
            )
            return ok(transaction)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
