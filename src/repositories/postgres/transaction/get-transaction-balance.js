import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetTransactionBalanceRepository {
    async execute(userId) {
        try {
            const [row] = await prisma.$queryRawUnsafe(
                `
        SELECT
          COALESCE(SUM(CASE WHEN type = 'EARNING'    THEN amount ELSE 0 END), 0) AS earnings,
          COALESCE(SUM(CASE WHEN type = 'EXPENSE'    THEN amount ELSE 0 END), 0) AS expenses,
          COALESCE(SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END), 0) AS investments
        FROM transactions
        WHERE user_id = $1
        `,
                userId,
            )

            // Normaliza valores (podem vir como string ou Decimal)
            const toNum = (v) =>
                v && v.toString ? Number(v.toString()) : Number(v)
            const earnings = toNum(row?.earnings ?? 0)
            const expenses = toNum(row?.expenses ?? 0)
            const investments = toNum(row?.investments ?? 0)
            const balance = earnings - expenses - investments

            return {
                earnings: earnings.toString(),
                expenses: expenses.toString(),
                investments: investments.toString(),
                balance: balance.toString(),
            }
        } catch (error) {
            console.error('❌ Erro ao calcular saldo de transações:', error)
            throw error
        }
    }
}
