import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../data/sqlite.db');
const db = new Database(dbPath);

export default db;
