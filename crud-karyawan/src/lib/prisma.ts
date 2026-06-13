import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

function parseMysqlUrl(url: string) {
  // mysql://user:password@host:port/database
  const u = new URL(url);
  return {
    host:     u.hostname,
    port:     parseInt(u.port || '3306'),
    user:     u.username,
    password: u.password,
    database: u.pathname.replace('/', ''),
    connectionLimit: 5,
  };
}

function createPrismaClient() {
  const config  = parseMysqlUrl(process.env.DATABASE_URL!);
  const adapter = new PrismaMariaDb(config);
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
