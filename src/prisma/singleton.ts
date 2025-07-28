// src/prisma/singleton.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // Extend globalThis to include prisma
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export {};

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
