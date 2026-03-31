const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data.db');
const db = new Database(dbPath);

console.log('--- Projects ---');
console.log(JSON.stringify(db.prepare('PRAGMA table_info(projects)').all(), null, 2));

console.log('--- Artists ---');
console.log(JSON.stringify(db.prepare('PRAGMA table_info(artists)').all(), null, 2));

db.close();
