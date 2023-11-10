import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
      db: {
        url: `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
      },
    },
  });
  

export { prisma };