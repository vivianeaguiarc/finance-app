export class TransactionNotFoundError extends Error {
    constructor(userId) {
        super(`Transaction not found for ID: ${userId}`)
        this.name = 'TransactionNotFoundError'
    }
}
