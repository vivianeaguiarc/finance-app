// // jest.setup-after-env.mjs (CÓDIGO CORRIGIDO)

// import { prisma } from './prisma/prisma.js' // Certifique-se de que a importação do prisma está correta

// beforeEach(async () => {
//     await prisma.$transaction(async (tx) => {
//         // 1. 🛑 CORREÇÃO: Deletar Transações (Tabela Filha) PRIMEIRO
//         await tx.transaction.deleteMany({})

//         // 2. Deletar Usuários (Tabela Pai) DEPOIS
//         await tx.user.deleteMany({})
//     })
// })


// import { prisma } from './prisma/prisma.js' // ajuste o path se for src/prisma/...

// jest.setTimeout(30000)

// beforeEach(async () => {
//     await prisma.$transaction(async (tx) => {
//         await tx.transaction.deleteMany({})
//         await tx.user.deleteMany({})
//     })
// })

// afterAll(async () => {
//     try {
//         await prisma.$disconnect()
//     // eslint-disable-next-line no-empty
//     } catch {}
// })
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

beforeEach(async () => {
    await prisma.$transaction(async (tx) => {
        try {
            await tx.transaction.deleteMany({})
        } catch {
            /* tabela pode não existir */
        }
        try {
            await tx.user.deleteMany({})
        } catch {
            /* idem */
        }
    })
})

afterAll(async () => {
    await prisma.$disconnect()
})
