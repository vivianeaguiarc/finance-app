import { AppError } from './app-error.js'

export class EmailAlreadyInUseError extends AppError {
    constructor() {
        super('This email is already in use.', 409, 'EMAIL_ALREADY_IN_USE')
        this.name = 'EmailAlreadyInUseError'
    }
}

export class UserNotFoundError extends AppError {
    constructor() {
        super('User not found.', 404, 'USER_NOT_FOUND')
        this.name = 'UserNotFoundError'
    }
}

export class InvalidPasswordError extends AppError {
    constructor() {
        super('Invalid email or password.', 401, 'INVALID_CREDENTIALS')
        this.name = 'InvalidPasswordError'
    }
}

export class ForbiddenError extends AppError {
    constructor() {
        super(
            'You do not have permission to perform this action.',
            403,
            'FORBIDDEN',
        )
        this.name = 'ForbiddenError'
    }
}

export class UnauthorizedError extends AppError {
    constructor() {
        super(
            'You must be logged in to perform this action.',
            401,
            'UNAUTHORIZED',
        )
        this.name = 'UnauthorizedError'
    }
}
