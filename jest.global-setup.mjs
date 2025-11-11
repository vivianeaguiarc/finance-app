import { execSync } from 'child_process';

async function init () {
    execSync('docker compose up -d postgres_test')
    execSync('npx dotenv -e .env.test -- prisma db push') 
}
export default init;


