const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const dbSource = path.join(rootDir, 'prisma', 'dev.db');
const backupsDir = path.join(rootDir, 'backups');

if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupPath = path.join(backupsDir, `scalemint-backup-${timestamp}.db`);

try {
  if (fs.existsSync(dbSource)) {
    fs.copyFileSync(dbSource, backupPath);
    const stats = fs.statSync(backupPath);
    console.log(`[Backup Success] Database safely copied to: ${backupPath} (${(stats.size / 1024).toFixed(1)} KB)`);
  } else {
    console.warn(`[Backup Warning] Source database not found at ${dbSource}`);
  }
} catch (error) {
  console.error('[Backup Error] Failed to create database snapshot:', error.message);
  process.exit(1);
}
