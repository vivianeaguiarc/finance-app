import {
    checkIfAmountIsValid,
    checkIfIdIsValid,
    checkIfTypeIsValid,
    created,
    invalidAmountResponse,
    invalidIdResponse,
    invalidTypeResponse,
    requiredFieldIsMissingResponse,
    serverError,
    validateRequiredFields,
} from '../helpers/index.js'
export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            const requiredFields = ['user_id', 'name', 'date', 'amount', 'type']

            const { ok: requiredFieldsWhereProvider, missingField } =
                validateRequiredFields(params, requiredFields)
            if (!requiredFieldsWhereProvider) {
                return requiredFieldIsMissingResponse(missingField)
            }
            const useridIsValid = checkIfIdIsValid(params.user_id)
            if (!useridIsValid) {
                return invalidIdResponse()
            }
            const amountIsValid = checkIfAmountIsValid(params.amount)
            if (!amountIsValid) {
                return invalidAmountResponse()
            }
            const type = params.type.trim().toUpperCase()
            const typesIsValid = checkIfTypeIsValid(type)
            if (!typesIsValid) {
                return invalidTypeResponse()
            }
            const transaction = await this.createTransactionUseCase.execute({
                ...params,
                type,
            })
            return created(transaction)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
