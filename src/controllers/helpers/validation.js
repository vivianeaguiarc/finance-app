import validator from 'validator'
import { badRequest } from './http.js'
export const checkIfIdIsValid = (id) => validator.isUUID(id)

export const invalidIdResponse = () => badRequest({ message: 'The provided ID is not valid' })
export const checkIfIdIsString = (value) => typeof value === 'string'
export const validatorRequiredFields = (params, requiredFields) => {
  for (const field of requiredFields) {
    const fieldIsMissing = !params[field]
    const fieldIsEmpty = checkIfIdIsString(
      params[field] && validator.isEmpty(params[field], { ignore_whitespace: true }),
    )
    if (fieldIsMissing || fieldIsEmpty) {
      return badRequest({ message: `Missing param: ${field}` })
    }
  }
}
