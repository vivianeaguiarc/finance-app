import express from 'express'
import cors from 'cors'
import { usersRouter, transactionsRouter } from './routes/index.js'
import { healthHandler } from './routes/health.js'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import { join } from 'path'
import { getCorsOptions } from './config/cors.js'
import { getHelmetMiddleware } from './config/helmet.js'
import { globalLimiter } from './middlewares/rate-limit.js'
import { requestIdMiddleware } from './middlewares/request-id.js'
import { requestLogger } from './middlewares/request-logger.js'
import { errorHandler } from './middlewares/error-handler.js'

export const app = express()

app.use(requestIdMiddleware)
app.use(requestLogger)
app.use(getHelmetMiddleware())
app.use(cors(getCorsOptions()))
app.use(express.json())
app.use(globalLimiter)

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'FinanceApp API is running',
        data: {
            docs: '/docs',
            health: '/health',
        },
        requestId: req.id,
    })
})

app.get('/health', healthHandler)

app.use('/api/users', usersRouter)
app.use('/api/transactions', transactionsRouter)

const swaggerPath = join(process.cwd(), 'docs', 'swagger.json')
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'))

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(errorHandler)
