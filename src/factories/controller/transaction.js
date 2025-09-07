import { PostgresCreateTransactionRepository } from '../../repositories/postgres/transaction/create-transaction.js'
import { PostgresGetUserByIdRepository } from '../../repositories/postgres/user/get-user-by-id.js'
import { CreateTransactionUseCase } from '../../use-cases/index.js'
import { CreateTransactionController } from '../../controllers/index.js'

export const makeCreateTransactionController = () => {
  const createTransactionRepository = new PostgresCreateTransactionRepository()
  const getUserByIdRepository = new PostgresGetUserByIdRepository()
  const createTransactionUseCase = new CreateTransactionUseCase(
    createTransactionRepository,
    getUserByIdRepository,
  )
  const createTransactionController = new CreateTransactionController(createTransactionUseCase)
  return createTransactionController
}
