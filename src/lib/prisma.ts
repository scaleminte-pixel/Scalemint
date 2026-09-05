import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

function getResolvedDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;

  // If a remote production database is configured (PostgreSQL, MySQL, CockroachDB, etc.)
  if (envUrl && !envUrl.startsWith('file:')) {
    return envUrl;
  }

  const cwd = process.cwd();
  const prismaDbPath = path.resolve(cwd, 'prisma', 'dev.db');
  const rootDbPath = path.resolve(cwd, 'dev.db');

  // Ensure prisma directory exists
  const prismaDir = path.resolve(cwd, 'prisma');
  if (!fs.existsSync(prismaDir)) {
    try {
      fs.mkdirSync(prismaDir, { recursive: true });
    } catch (e) {
      // ignore
    }
  }

  let chosenPath = prismaDbPath;

  const prismaDbExists = fs.existsSync(prismaDbPath) && fs.statSync(prismaDbPath).size > 0;
  const rootDbExists = fs.existsSync(rootDbPath) && fs.statSync(rootDbPath).size > 0;

  if (prismaDbExists) {
    chosenPath = prismaDbPath;
    // Mirror to root dev.db so both locations are valid
    try {
      if (!rootDbExists) {
        fs.copyFileSync(prismaDbPath, rootDbPath);
      }
    } catch (e) {
      // ignore
    }
  } else if (rootDbExists) {
    chosenPath = rootDbPath;
    // Mirror to prisma/dev.db
    try {
      if (!prismaDbExists) {
        fs.copyFileSync(rootDbPath, prismaDbPath);
      }
    } catch (e) {
      // ignore
    }
  } else {
    chosenPath = prismaDbPath;
  }

  const normalized = chosenPath.replace(/\\/g, '/');
  const finalUrl = `file:${normalized}`;
  process.env.DATABASE_URL = finalUrl;
  return finalUrl;
}

const resolvedUrl = getResolvedDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: resolvedUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
