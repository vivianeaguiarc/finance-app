import {
    badRequest,
    checkIfIdIsValid,
    created,
    invalidIdResponse,
    serverError,
} from '../helpers/index.js'
import validator from 'validator'
export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            const requiredFields = [
                'id',
                'user_id',
                'name',
                'date',
                'amount',
                'type',
            ]
            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return badRequest({
                        message: `Missing or empty field: ${field}`,
                    })
                }
            }
            const useridIsValid = checkIfIdIsValid(params.user_id)
            if (!useridIsValid) {
                return invalidIdResponse()
            }
            if (params.amout <= 0) {
                return badRequest({
                    message: 'The amount must be greater than 0.',
                })
            }
            const amountIsValid = validator.isCurrency(
                params.amount.toString(),
                {
                    digits_after_decimal: [2],
                    allow_decimal: false,
                    decimal_separator: '.',
                },
            )
            if (!amountIsValid) {
                return badRequest({
                    message: 'The amount must be a valid currency.',
                })
            }
            const type = params.type.trim().toUppercase()
            const typesIsValid = ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(
                params.type,
            )
            if (!typesIsValid) {
                return badRequest({
                    message: 'The type must be EARNING, EXPENSE, INVESTMENT',
                })
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
