import 'dotenv/config'
import { app } from './src/app.js'
import { logger } from './src/config/logger.js'

const port = Number(process.env.PORT) || 3000

app.listen(port, () => {
    logger.info(
        { port, environment: process.env.NODE_ENV || 'development' },
        'Server started',
    )
})
