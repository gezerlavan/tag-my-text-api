import Database from 'better-sqlite3'

// Create or open database file
const db = new Database('data.db')

// Create table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS ai_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    endpoint TEXT,
    input TEXT,
    output TEXT,
    created_at TEXT
  );
`)

export { db }
