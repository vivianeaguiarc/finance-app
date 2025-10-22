import 'dotenv/config'
import express from 'express'
import { PostgresHelper } from './src/db/postgres/helper.js'

const app = express()

app.get('/', async (request, response) => {
    const results = await PostgresHelper.query('SELECT * FROM users;')
    response.send(JSON.stringify(results))
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
