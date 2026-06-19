import { AppError } from './app-error.js'

export class TransactionNotFoundError extends AppError {
    constructor() {
        super('Transaction not found.', 404, 'TRANSACTION_NOT_FOUND')
        this.name = 'TransactionNotFoundError'
    }
}
