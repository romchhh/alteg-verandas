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
      description TEXT,
      description_en TEXT,
      applications TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS category_overrides (
      id TEXT PRIMARY KEY,
      name TEXT,
      name_en TEXT,
      description TEXT,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS custom_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_en TEXT NOT NULL,
      description TEXT,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      total REAL NOT NULL,
      total_weight REAL NOT NULL,
      payload TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS homepage (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    INSERT OR IGNORE INTO homepage (key, value) VALUES
      ('heroTitle', 'ALTEG UK Aluminium Profiles Direct from the Manufacturer'),
      ('heroSubtitle', 'Buy aluminium angles, tubes, sheets directly from manufacturer. UK delivery. Factory prices.');

    -- Seed a few demo products (for testing) if they don't exist yet
    INSERT OR IGNORE INTO products (
      id, category, name, name_en, dimensions,
      price_per_meter, price_per_kg, weight_per_meter,
      standard_lengths, in_stock, material, finish, image,
      description, description_en, applications
    ) VALUES
      -- Verandas & Canopies (use custom_profile category)
      ('veranda-kit-4000x3000-poly', 'custom_profile',
       'Veranda Kit 4000x3000 Polycarbonate', 'Veranda Kit 4000x3000 Polycarbonate', '4000 x 3000 mm',
       2980.00, NULL, 1.0,
       '[4.0]', 1, 'Aluminium', 'Powder coated anthracite', '/verandas/veranda_4000x3000_poly.jpg',
       'Test veranda kit with polycarbonate roof (from price, excl. VAT).', 'Test veranda kit with polycarbonate roof (from price, excl. VAT).',
       '["Verandas & Canopies"]'),
      ('veranda-kit-6000x4000-vsg', 'custom_profile',
       'Veranda Kit 6000x4000 Glass', 'Veranda Kit 6000x4000 Glass', '6000 x 4000 mm',
       4970.00, NULL, 1.0,
       '[6.0]', 1, 'Aluminium', 'Powder coated anthracite', '/verandas/veranda_6000x4000_glass.jpg',
       'Test veranda kit with laminated safety glass (from price, excl. VAT).', 'Test veranda kit with laminated safety glass (from price, excl. VAT).',
       '["Verandas & Canopies"]'),

      -- Aluminium Fencing (use square_bar category)
      ('fencing-run-10m', 'square_bar',
       'Aluminium Fence Line 10m', 'Aluminium Fence Line 10m', 'Height 1.0 m, length 10 m',
       1000.00, NULL, 1.0,
       '[1.0]', 1, 'Aluminium', 'Powder coated RAL 7016', '/fencing/fence_line_10m.jpg',
       'Test aluminium fencing run of ~10 m (from price, excl. VAT).', 'Test aluminium fencing run of ~10 m (from price, excl. VAT).',
       '["Aluminium Fencing"]'),
      ('fencing-run-20m', 'square_bar',
       'Aluminium Fence Line 20m', 'Aluminium Fence Line 20m', 'Height 1.0 m, length 20 m',
       2000.00, NULL, 1.0,
       '[1.0]', 1, 'Aluminium', 'Powder coated RAL 7016', '/fencing/fence_line_20m.jpg',
       'Test aluminium fencing run of ~20 m (from price, excl. VAT).', 'Test aluminium fencing run of ~20 m (from price, excl. VAT).',
       '["Aluminium Fencing"]'),

      -- Profile Systems
      ('profile-post-110x110', 'angle',
       'Support Post 110x110mm', 'Support Post 110x110mm', 'Approx. 110 x 110 mm',
       NULL, 6.50, 8.0,
       '[3.0,4.0,6.0]', 1, 'Aluminium', 'Powder coated', '/profiles/support_post_110x110.jpg',
       'Test support post profile for veranda and canopy structures.', 'Test support post profile for veranda and canopy structures.',
       '["Profile Systems"]'),
      ('profile-rafter-60x120', 'channel',
       'Rafter / Beam 60x120mm', 'Rafter / Beam 60x120mm', 'Approx. 60 x 120 mm',
       NULL, 7.20, 7.5,
       '[3.0,4.0,6.0]', 1, 'Aluminium', 'Powder coated', '/profiles/rafter_60x120.jpg',
       'Test rafter / beam profile for glass and polycarbonate roofs.', 'Test rafter / beam profile for glass and polycarbonate roofs.',
       '["Profile Systems"]'),

      -- Accessories & Guttering
      ('accessory-gutter-kit', 'sheet',
       'Gutter & Downpipe Kit', 'Gutter & Downpipe Kit', 'For veranda widths 4–6 m',
       320.00, NULL, 1.0,
       '[4.0,6.0]', 1, 'Aluminium', 'Powder coated', '/accessories/gutter_kit.jpg',
       'Test gutter and downpipe kit for veranda installations.', 'Test gutter and downpipe kit for veranda installations.',
       '["Accessories & Guttering"]'),
      ('accessory-seal-pack', 'sheet',
       'EPDM Seal Pack', 'EPDM Seal Pack', 'For glass/polycarbonate infill',
       95.00, NULL, 1.0,
       '[1.0]', 1, 'EPDM', 'Black', '/accessories/seal_pack.jpg',
       'Test pack of EPDM seals and gaskets for veranda roofs.', 'Test pack of EPDM seals and gaskets for veranda roofs.',
       '["Accessories & Guttering"]');
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
}

export { getDb };
