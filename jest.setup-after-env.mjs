// jest.setup-after-env.mjs (CÓDIGO CORRIGIDO)

import { prisma } from './prisma/prisma.js' // Certifique-se de que a importação do prisma está correta

beforeEach(async () => {
    await prisma.$transaction(async (tx) => {
        // 1. 🛑 CORREÇÃO: Deletar Transações (Tabela Filha) PRIMEIRO
        await tx.transaction.deleteMany({})

        // 2. Deletar Usuários (Tabela Pai) DEPOIS
        await tx.user.deleteMany({})
    })
})

