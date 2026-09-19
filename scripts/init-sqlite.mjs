import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const projectRoot = path.resolve(new URL('..', import.meta.url).pathname);
const dbDir = path.join(projectRoot, 'data');
const dbFile = path.join(dbDir, 'careflow.db');
const schemaPath = path.join(projectRoot, 'database', 'sqlite', 'schema.sql');

fs.mkdirSync(dbDir, { recursive: true });

const schema = fs.readFileSync(schemaPath, 'utf8');
const db = new Database(dbFile);

db.exec(schema);

const stats = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
console.log(`SQLite database initialized at ${dbFile}`);
console.log(`Tables: ${stats.map((row) => row.name).join(', ')}`);

db.close();
