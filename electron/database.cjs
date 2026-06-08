const Database = require('better-sqlite3')
const path = require('path')
const { app } = require('electron')

const db = new Database(path.join(app.getPath('userData'), 'zaras-store.db'))

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    barcode TEXT UNIQUE,
    retail_price REAL NOT NULL DEFAULT 0,
    wholesale_price REAL,
    category TEXT DEFAULT 'General',
    stock INTEGER DEFAULT 0,
    unit TEXT DEFAULT 'pc',
    created_at TEXT DEFAULT (datetime('now'))
  )
`)

module.exports = db