import validator from 'validator'
import { serverError } from '../../helpers/http.js'
import { badRequest, invalidIdResponse } from '../helpers'

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase
  }
  async execute(httpRequest) {
    try {
      const params = httpRequest.body
      const requiredFields = ['id', 'userId', 'name', 'amount', 'date', 'type']
      for (const field of requiredFields) {
        if (!params[field] || params[field].toString().length === 0) {
          return badRequest({
            message: `Missing param: ${field}`,
          })
        }
      }
      // eslint-disable-next-line no-undef
      const userIdIsValid = checkIfIdIsValid(params.userId)
      if (!userIdIsValid) {
        return invalidIdResponse()
      }
      if (params.amount < 0) {
        return badRequest({
          message: 'The amount must be greater than 0',
        })
      }
      const amountIsValid = validator.isCurrency(params.amount.toString(), {
        digits_after_decimal: [2],
        allow_negatives: false,
        decimal_separator: '.',
      })
      if (!amountIsValid) {
        return badRequest({
          message: 'The amount must be a valid currency',
        })
      }
      const type = params.trim().toUpperCase()
      const typeIsValid = ['EARNING', 'EXPENSE'].includes(type)
      if (!typeIsValid) {
        return badRequest({
          message: 'The type must be either EARNING, EXPENSE or INVESTMENT',
        })
      }
      const transaction = {
        ...params,
        type,
      }
      // eslint-disable-next-line no-undef
      return created(transaction)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
