const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('--- [Scalemint Production DB Initialization] Starting ---');

const cwd = process.cwd();
const prismaDir = path.resolve(cwd, 'prisma');
if (!fs.existsSync(prismaDir)) {
  fs.mkdirSync(prismaDir, { recursive: true });
}

const prismaDbPath = path.resolve(prismaDir, 'dev.db');
const rootDbPath = path.resolve(cwd, 'dev.db');

try {
  // 1. Sync existing database file if one exists
  if (fs.existsSync(prismaDbPath) && fs.statSync(prismaDbPath).size > 0) {
    if (!fs.existsSync(rootDbPath) || fs.statSync(rootDbPath).size === 0) {
      fs.copyFileSync(prismaDbPath, rootDbPath);
      console.log('[DB-INIT] Mirrored prisma/dev.db -> root dev.db');
    }
  } else if (fs.existsSync(rootDbPath) && fs.statSync(rootDbPath).size > 0) {
    if (!fs.existsSync(prismaDbPath) || fs.statSync(prismaDbPath).size === 0) {
      fs.copyFileSync(rootDbPath, prismaDbPath);
      console.log('[DB-INIT] Mirrored root dev.db -> prisma/dev.db');
    }
  }

  // 2. Ensure schema tables are created in SQLite
  console.log('[DB-INIT] Executing prisma db push...');
  execSync('npx prisma db push --accept-data-loss --skip-generate', { stdio: 'inherit' });

  // 3. Run seeds
  console.log('[DB-INIT] Running seed scripts...');
  execSync('node prisma/seed.js', { stdio: 'inherit' });
  execSync('node prisma/seed-portfolio.js', { stdio: 'inherit' });
  execSync('node prisma/seed-extra.js', { stdio: 'inherit' });
  execSync('node prisma/seed-sections.js', { stdio: 'inherit' });
  execSync('node scripts/import-growth-packages.mjs', { stdio: 'inherit' });

  // 4. Ensure root and prisma files are both updated with the latest seed
  if (fs.existsSync(prismaDbPath)) {
    fs.copyFileSync(prismaDbPath, rootDbPath);
  }

  console.log('--- [Scalemint Production DB Initialization] Completed Successfully ---');
} catch (error) {
  console.error('[DB-INIT ERROR]:', error.message);
  // Do not abort build if database already exists
}
