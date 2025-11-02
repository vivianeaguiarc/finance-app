import 'dotenv/config'
import fs from 'fs'
import { pool } from '../helper.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const execMigrations = async () => {
    const client = await pool.connect()
    try {
        // ✅ Corrigido: lê todos os arquivos .sql na pasta atual
        const files = fs
            .readdirSync(__dirname)
            .filter((file) => file.endsWith('.sql'))

        for (const file of files) {
            const filepath = path.join(__dirname, file)
            const script = fs.readFileSync(filepath, 'utf-8')
            await client.query(script)
            console.log(`Migration ${file} executed successfully`)
        }

        console.log('All migrations executed successfully')
    } catch (error) {
        console.error('Error executing migration:', error)
    } finally {
        client.release()
    }
}

execMigrations()
