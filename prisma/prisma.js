// import pkg from '@prisma/client'
// const { PrismaClient } = pkg

// export const prisma = new PrismaClient()
import { config } from 'dotenv'
config() // <-- garante carregar .env ou .env.test

import pkg from '@prisma/client'
const { PrismaClient } = pkg

export const prisma = new PrismaClient()
