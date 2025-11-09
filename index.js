import 'dotenv/config'
import express from 'express'
import { usersRouter, transactionsRouter } from './src/routes/index.js'

const app = express()
app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/transactions', transactionsRouter)

app.listen(3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`)
})
