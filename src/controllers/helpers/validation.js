import validator from 'validator'
import { badRequest } from './http.js'

export const checkIfIdIsValid = (id) => validator.isUUID(id)

export const invalidIdResponse = () =>
    badRequest('The provided id is not valid.', 'INVALID_ID')

export const requiredFieldIsMissingResponse = (field) =>
    badRequest(`The field ${field} is required`, 'MISSING_FIELD')
