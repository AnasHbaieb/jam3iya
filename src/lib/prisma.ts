// Import PrismaClient from the generated @prisma/client package
import { PrismaClient } from '@prisma/client'

// TypeScript type declaration for global Prisma instance
// This ensures we don't create multiple instances of Prisma Client
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Create a single instance of Prisma Client
// If it already exists in the global scope, reuse it
// This prevents multiple instances during development hot reloading
export const prisma = 
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'], // Enable query logging for debugging
  })

// In development, save the prisma instance to the global object
// This ensures we reuse the same instance across hot-reloads
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
