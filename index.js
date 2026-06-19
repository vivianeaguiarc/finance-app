import 'dotenv/config'
import { app } from './src/app.js'
import { logger } from './src/config/logger.js'
import { getCacheService } from './src/adapters/cache-service.js'

const port = Number(process.env.PORT) || 3000

await getCacheService()
    .init()
    .catch((error) => {
        logger.warn({ err: error }, 'Cache initialization failed')
    })

app.listen(port, () => {
    logger.info(
        { port, environment: process.env.NODE_ENV || 'development' },
        'Server started',
    )
})
