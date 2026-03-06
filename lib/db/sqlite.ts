import Database from 'better-sqlite3';
import path from 'path';
import { mkdirSync, existsSync } from 'fs';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'alteg.db');

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (db) return db;

  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');

  initSchema(db);
  return db;
}

function initSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      name_en TEXT NOT NULL,
      dimensions TEXT NOT NULL,
      price_per_meter REAL,
      price_per_kg REAL,
      weight_per_meter REAL NOT NULL,
      standard_lengths TEXT NOT NULL,
      in_stock INTEGER NOT NULL DEFAULT 1,
      material TEXT,
      finish TEXT,
      image TEXT,
      images TEXT,
      description TEXT,
      description_en TEXT,
      applications TEXT,
      price_unit TEXT,
      supplier_price_per_meter REAL,
      supplier_price_per_m2_set REAL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
  try {
    database.exec('ALTER TABLE products ADD COLUMN hidden INTEGER NOT NULL DEFAULT 0');
  } catch {
    // Column already exists
  }
  try {
    database.exec("ALTER TABLE orders ADD COLUMN status TEXT NOT NULL DEFAULT 'new'");
  } catch {
    // Column already exists
  }
  try {
    database.exec('ALTER TABLE products ADD COLUMN supplier_price_per_meter REAL');
  } catch {
    // Column already exists
  }
  try {
    database.exec('ALTER TABLE products ADD COLUMN supplier_price_per_m2_set REAL');
  } catch {
    // Column already exists
  }
  try {
    database.exec('ALTER TABLE products ADD COLUMN price_unit TEXT');
  } catch {
    // Column already exists
  }
  try {
    database.exec('ALTER TABLE products ADD COLUMN images TEXT');
  } catch {
    // Column already exists
  }
}

export { getDb };
