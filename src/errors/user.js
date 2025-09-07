// src/errors/user.js
export class EmailAlreadyInUseError extends Error {
  constructor(email) {
    super(`Email already in use: ${email}`)
    this.name = 'EmailAlreadyInUseError'
  }
}
export class UserNotFoundError extends Error {
  constructor(userId) {
    super(`User with id: ${userId} not found`)
    this.name = 'UserNotFoundError'
  }
}
