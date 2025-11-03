import pkg from '@prisma/client'

const { PrismaClient } = pkg
const prisma = new PrismaClient()

try {
  await prisma.$connect()
  console.log('✅ Prisma Client conectado com sucesso!')
} catch (err) {
  console.error('❌ Erro ao conectar:', err)
} finally {
  await prisma.$disconnect()
}
