// import { prisma } from './prisma/prisma.js'

// beforeEach(async () => {
//     await prisma.transaction.deleteMany({})
//     await prisma.user.deleteMany()
// })
// jest.setup-after-env.mjs
import { prisma } from './prisma/prisma.js'

// Limpa o banco antes de cada teste
beforeEach(async () => {
  await prisma.$transaction(async (tx) => {
    await tx.transaction.deleteMany({})
    await tx.user.deleteMany({})
  })
})
