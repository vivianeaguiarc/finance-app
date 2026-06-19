import { AppError } from './app-error.js'

export class CategoryNotFoundError extends AppError {
    constructor(categoryId) {
        super(`Category ${categoryId} not found`, 404, 'CATEGORY_NOT_FOUND')
        this.name = 'CategoryNotFoundError'
    }
}

export class CategoryForbiddenError extends AppError {
    constructor() {
        super(
            'You do not have permission to access this category',
            403,
            'FORBIDDEN',
        )
        this.name = 'CategoryForbiddenError'
    }
}

export class CategoryAlreadyExistsError extends AppError {
    constructor(name) {
        super(
            `Category "${name}" already exists for this user`,
            409,
            'CATEGORY_ALREADY_EXISTS',
        )
        this.name = 'CategoryAlreadyExistsError'
    }
}
