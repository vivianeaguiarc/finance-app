// src/errors/user.js
export class EmailAlreadyInUseError extends Error {
  constructor(email) {
    super(`Email already in use: ${email}`);
    this.name = 'EmailAlreadyInUseError';
  }
}
