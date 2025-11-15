// // prisma/prisma.js
// import { PrismaClient } from '@prisma/client'

// export const prisma = new PrismaClient()
import pkg from '@prisma/client'
const { PrismaClient } = pkg

export const prisma = new PrismaClient()
