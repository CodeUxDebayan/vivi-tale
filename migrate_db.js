const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data.db');
const db = new Database(dbPath);

try {
  db.exec('ALTER TABLE projects ADD COLUMN slug TEXT;');
  db.exec('ALTER TABLE projects ADD COLUMN artistSlug TEXT;');
  console.log('Migration successful: added slug and artistSlug columns.');
} catch (err) {
  console.log('Migration skipped or failed (possibly columns already exist):', err.message);
}

db.close();
