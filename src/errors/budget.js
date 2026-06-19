import { AppError } from './app-error.js'

export class BudgetNotFoundError extends AppError {
    constructor(budgetId) {
        super(`Budget ${budgetId} not found`, 404, 'BUDGET_NOT_FOUND')
        this.name = 'BudgetNotFoundError'
    }
}

export class BudgetAlreadyExistsError extends AppError {
    constructor() {
        super(
            'A budget already exists for this category, month and year',
            409,
            'BUDGET_ALREADY_EXISTS',
        )
        this.name = 'BudgetAlreadyExistsError'
    }
}
