// index.js (raiz do app)
import 'dotenv/config'
import express from 'express'

import {
  makeCreateUserController,
  makeGetUserByIdController,
  makeUpdateUserController,
  makeDeleteUserController,
} from './src/factories/controller/user.js'
import { makeCreateTransactionController } from './src/factories/controller/transaction.js'
const app = express()
app.use(express.json())

app.get('/api/users/:userId', async (request, response) => {
  const controller = makeGetUserByIdController()
  const { statusCode, body } = await controller.execute(request)
  response.status(statusCode).send(body)
})

app.post('/api/users', async (request, response) => {
  const createUserController = makeCreateUserController()
  const { statusCode, body } = await createUserController.execute(request)
  response.status(statusCode).send(body)
})

app.patch('/api/users/:userId', async (request, response) => {
  const updateUserController = makeUpdateUserController()
  const { statusCode, body } = await updateUserController.execute(request)
  response.status(statusCode).send(body)
})

app.delete('/api/users/:userId', async (request, response) => {
  const deleteUserController = makeDeleteUserController()
  const { statusCode, body } = await deleteUserController.execute(request)
  response.status(statusCode).send(body)
})
app.post('/api/transactions', async (request, response) => {
  const createTransactionController = makeCreateTransactionController()
  const { statusCode, body } = await createTransactionController.execute(request)
  response.status(statusCode).send(body)
})
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
