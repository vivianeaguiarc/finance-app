export class TransactionNotFoundError extends Error {
    constructor(transactionId) {
        super(`Transaction not found for ID: ${transactionId}`)
        this.name = 'TransactionNotFoundError'
    }
}
