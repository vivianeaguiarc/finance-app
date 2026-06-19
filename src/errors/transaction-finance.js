import { AppError } from './app-error.js'

export class InvalidInstallmentError extends AppError {
    constructor(message) {
        super(message, 400, 'INVALID_INSTALLMENT')
        this.name = 'InvalidInstallmentError'
    }
}

export class InvalidRecurrenceError extends AppError {
    constructor(message) {
        super(message, 400, 'INVALID_RECURRENCE')
        this.name = 'InvalidRecurrenceError'
    }
}
