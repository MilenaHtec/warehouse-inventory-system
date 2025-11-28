import Database from 'better-sqlite3';
import { env } from './env.js';
import { logger } from '../utils/logger.js';
import { dirname } from 'path';
import { mkdirSync, existsSync } from 'fs';

let db: Database.Database | null = null;

// ============================================
// Database Connection
// ============================================

export function getDatabase(): Database.Database {
  if (!db) {
    // Create data directory if it doesn't exist
    const dbPath = env.DATABASE_PATH;
    if (dbPath !== ':memory:') {
      const dir = dirname(dbPath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    }

    db = new Database(dbPath);
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON');
    
    // Enable WAL mode for better performance
    if (!env.isTest) {
      db.pragma('journal_mode = WAL');
    }
    
    logger.info('Database connected', { path: dbPath });
  }
  return db;
}

// ============================================
// Close Database Connection
// ============================================

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
    logger.info('Database connection closed');
  }
}

// ============================================
// Run Migrations
// ============================================

export function runMigrations(): void {
  const database = getDatabase();
  
  logger.info('Running database migrations...');
  
  // Create categories table
  database.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Create products table
  database.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(200) NOT NULL,
      product_code VARCHAR(50) NOT NULL UNIQUE,
      price DECIMAL(10,2) NOT NULL CHECK(price >= 0),
      quantity INTEGER NOT NULL DEFAULT 0 CHECK(quantity >= 0),
      category_id INTEGER NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
    )
  `);
  
  // Create inventory_history table
  database.exec(`
    CREATE TABLE IF NOT EXISTS inventory_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      change_type VARCHAR(20) NOT NULL CHECK(change_type IN ('increase', 'decrease', 'adjustment')),
      quantity_change INTEGER NOT NULL,
      quantity_before INTEGER NOT NULL,
      quantity_after INTEGER NOT NULL,
      reason TEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    )
  `);
  
  // Create indexes
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_products_code ON products(product_code);
    CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
    CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory_history(product_id);
    CREATE INDEX IF NOT EXISTS idx_inventory_created ON inventory_history(created_at);
  `);
  
  logger.info('Database migrations completed');
}

// ============================================
// Transaction Helper
// ============================================

export function transaction<T>(fn: () => T): T {
  const database = getDatabase();
  return database.transaction(fn)();
}

