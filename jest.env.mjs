import { config } from 'dotenv'
import { existsSync } from 'fs'

if (existsSync('.env.test')) {
    config({ path: '.env.test', override: true })
} else if (existsSync('.env')) {
    config()
}

process.env.NODE_ENV = 'test'
