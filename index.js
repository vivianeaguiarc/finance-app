import 'dotenv/config'
import express from 'express'

import {
    makeCreateTransactionController,
    makeGetTransactionsByUserIdController,
    makeUpdateTransactionController,
    makeDeleteTransactionController,
} from './src/factories/controllers/transaction.js'
import { usersRouter } from './src/routes/user.js'

const app = express()
app.use(express.json())

app.use('/api/users', usersRouter)

app.get('/api/transactions', async (request, response) => {
    const getTransactionsByUserIdController =
        makeGetTransactionsByUserIdController()
    const { statusCode, body } =
        await getTransactionsByUserIdController.execute(request)
    response.status(statusCode).send(body)
})

app.post('/api/transactions', async (request, response) => {
    const createTransactionController = makeCreateTransactionController()
    const { statusCode, body } =
        await createTransactionController.execute(request)
    response.status(statusCode).send(body)
})
app.patch('/api/transactions/:transactionId', async (request, response) => {
    const updateTransactionController = makeUpdateTransactionController()
    const { statusCode, body } =
        await updateTransactionController.execute(request)
    response.status(statusCode).send(body)
})
app.delete('/api/transactions/:transactionId', async (request, response) => {
    const deleteTransactionController = makeDeleteTransactionController()
    const { statusCode, body } =
        await deleteTransactionController.execute(request)
    response.status(statusCode).send(body)
})
app.listen(3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`)
})
