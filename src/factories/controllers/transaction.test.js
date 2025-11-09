import { CreateTransactionController } from '../../controllers/transaction/create-transaction.js'
import { makeCreateTransactionController } from './transaction.js'

describe('Transaction Controller Factory', () => {
    it('should return a valid CreateTransactionController instance', () => {
        expect(makeCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        )
    })
})
