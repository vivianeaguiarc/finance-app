import { CreateTransactionController } from '../../controllers/transaction/create-transaction.js'
import { makeCreateTransactionController } from './transaction.js'

import { UpdateTransactionController } from '../../controllers/transaction/update-transaction.js'
import { makeUpdateTransactionController } from './transaction.js'

import { DeleteTransactionController } from '../../controllers/transaction/delete-transaction.js'
import { makeDeleteTransactionController } from './transaction.js'

// ✅ alinhar nome do arquivo e dos símbolos
import { GetTransactionByUserIdController } from '../../controllers/transaction/get-transaction-by-user-id.js'
import { makeGetTransactionsByUserIdController } from './transaction.js'

describe('Transaction Controller Factory', () => {
    it('should return a valid CreateTransactionController instance', () => {
        expect(makeCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        )
    })

    it('should return a valid UpdateTransactionController instance', () => {
        expect(makeUpdateTransactionController()).toBeInstanceOf(
            UpdateTransactionController,
        )
    })

    it('should return a valid DeleteTransactionController instance', () => {
        expect(makeDeleteTransactionController()).toBeInstanceOf(
            DeleteTransactionController,
        )
    })

    it('should return a valid GetTransactionByUserIdController instance', () => {
        expect(makeGetTransactionsByUserIdController()).toBeInstanceOf(
            GetTransactionByUserIdController,
        )
    })
})
