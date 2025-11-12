// import { execSync } from 'child_process';

// async function init () {
//     execSync('docker compose up -d postgres_test')
//     execSync('npx dotenv -e .env.test -- prisma db push') 
// }
// export default init;


// jest.global-setup.mjs
import { execSync } from 'node:child_process'

export default async () => {
  if (process.env.CI) {
    // No GitHub Actions o Postgres já vem como service, não suba Docker aqui.
    return
  }
  // Ambiente local: sobe o serviço de teste via docker compose
  try {
    execSync('docker compose up -d postgres-test', { stdio: 'inherit' }) // <- nome correto
  } catch (e) {
    console.error('Erro ao subir postgres-test:', e)
    process.exit(1)
  }
}
