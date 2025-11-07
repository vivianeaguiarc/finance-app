import { prisma } from './prisma/prisma.js'

beforeEach(async () => {
  await prisma.$transaction(async (tx) => {
    await tx.transaction.deleteMany({})
    await tx.user.deleteMany({})
  })
})
