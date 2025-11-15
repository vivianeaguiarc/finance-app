export class EmailAlreadyInUseError extends Error {
    constructor(email) {
        super(`The email address ${email} is already in use.`)
        this.name = 'EmailAlreadyInUseError'
    }
}
export class UserNotFoundError extends Error {
    constructor(userId) {
        super(`User with id ${userId} not found.`)
        this.name = 'UserNotFoundError'
    }
}
export class InvalidPasswordError extends Error {
    constructor() {
        super(`The provided password is invalid.`)
        this.name = 'InvalidPasswordError'
    }
}
