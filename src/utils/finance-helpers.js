import {
    CategoryForbiddenError,
    CategoryNotFoundError,
} from '../errors/category.js'
import { decimalToAmount } from './dashboard-query.js'

export async function assertCategoryOwnership(
    getCategoryByIdRepository,
    userId,
    categoryId,
) {
    if (!categoryId) {
        return null
    }

    const category = await getCategoryByIdRepository.execute(categoryId)

    if (!category) {
        throw new CategoryNotFoundError(categoryId)
    }

    if (category.user_id !== userId) {
        throw new CategoryForbiddenError()
    }

    return category
}

export function serializeTransaction(transaction) {
    return {
        ...transaction,
        amount: decimalToAmount(transaction.amount),
        date:
            transaction.date instanceof Date
                ? transaction.date.toISOString()
                : transaction.date,
        recurrence_end_date: transaction.recurrence_end_date
            ? new Date(transaction.recurrence_end_date).toISOString()
            : null,
        created_at:
            transaction.created_at instanceof Date
                ? transaction.created_at.toISOString()
                : transaction.created_at,
    }
}

export function serializeTransactions(transactions) {
    return transactions.map(serializeTransaction)
}
