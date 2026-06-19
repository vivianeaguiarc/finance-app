import { notFound } from './http.js'

export const transactionNotFoundResponse = () =>
    notFound('Transaction not found.', 'TRANSACTION_NOT_FOUND')
