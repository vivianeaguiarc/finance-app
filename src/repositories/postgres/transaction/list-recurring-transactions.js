import { prisma } from '../../../../prisma/prisma.js'

const RECURRING_SELECT = {
    id: true,
    user_id: true,
    category_id: true,
    name: true,
    date: true,
    amount: true,
    type: true,
    is_recurring: true,
    recurrence_type: true,
    recurrence_end_date: true,
    parent_transaction_id: true,
    is_installment: true,
    installment_number: true,
    total_installments: true,
    installment_group_id: true,
    created_at: true,
    _count: {
        select: { children: true },
    },
}

export class PostgresListRecurringTransactionsRepository {
    async execute(userId) {
        return prisma.transaction.findMany({
            where: {
                user_id: userId,
                is_recurring: true,
                parent_transaction_id: null,
            },
            select: RECURRING_SELECT,
            orderBy: { date: 'desc' },
        })
    }
}
