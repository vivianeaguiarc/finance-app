// src/controllers/transaction/create-Transaction.js
import validator from 'validator'
import { serverError } from '../helpers/http.js'
import { badRequest, invalidIdResponse, created, checkIfIdIsValid } from '../helpers/index.js'

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.body
      const requiredFields = ['user_id', 'name', 'amount', 'date', 'type']

      if (!params) {
        return badRequest({ message: 'Request body is missing.' })
      }

      const userIdIsValid = checkIfIdIsValid(params.user_id)
      if (!userIdIsValid) {
        return invalidIdResponse()
      }

      if (params.amount < 0) {
        return badRequest({ message: 'The amount must be greater than 0' })
      }

      const amountIsValid = validator.isCurrency(params.amount.toString(), {
        digits_after_decimal: [2],
        allow_negatives: false,
        decimal_separator: '.',
      })
      if (!amountIsValid) {
        return badRequest({ message: 'The amount must be a valid currency' })
      }

      const type = params.type.trim().toUpperCase()
      const typeIsValid = ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(type)
      if (!typeIsValid) {
        return badRequest({ message: 'The type must be either EARNING, EXPENSE or INVESTMENT' })
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
