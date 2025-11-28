import { getDatabase, runMigrations, closeDatabase } from './database.js';

// Seed data
const categories = [
  { name: 'Electronics', description: 'Electronic devices and accessories' },
  { name: 'Clothing', description: 'Apparel and fashion items' },
  { name: 'Food & Beverages', description: 'Food products and drinks' },
  { name: 'Home & Garden', description: 'Home improvement and garden supplies' },
  { name: 'Office Supplies', description: 'Office equipment and stationery' },
];

const products = [
  { name: 'Wireless Mouse', code: 'ELEC-001', price: 29.99, qty: 150, cat: 1 },
  { name: 'USB-C Hub', code: 'ELEC-002', price: 49.99, qty: 75, cat: 1 },
  { name: 'Mechanical Keyboard', code: 'ELEC-003', price: 89.99, qty: 50, cat: 1 },
  { name: 'Cotton T-Shirt', code: 'CLTH-001', price: 19.99, qty: 200, cat: 2 },
  { name: 'Denim Jeans', code: 'CLTH-002', price: 59.99, qty: 100, cat: 2 },
  { name: 'Organic Coffee Beans', code: 'FOOD-001', price: 14.99, qty: 300, cat: 3 },
  { name: 'Green Tea Pack', code: 'FOOD-002', price: 8.99, qty: 250, cat: 3 },
  { name: 'Garden Hose', code: 'HOME-001', price: 34.99, qty: 40, cat: 4 },
  { name: 'Plant Pot Set', code: 'HOME-002', price: 24.99, qty: 80, cat: 4 },
  { name: 'A4 Paper Ream', code: 'OFFC-001', price: 7.99, qty: 500, cat: 5 },
  { name: 'Ballpoint Pen Pack', code: 'OFFC-002', price: 4.99, qty: 1000, cat: 5 },
];

async function seed() {
  console.log('🌱 Starting database seed...');
  
  // Run migrations first
  runMigrations();
  
  const db = getDatabase();
  
  // Check if already seeded
  const existingCategories = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
  if (existingCategories.count > 0) {
    console.log('⚠️  Database already seeded. Skipping...');
    closeDatabase();
    return;
  }
  
  // Insert categories
  const insertCategory = db.prepare(
    'INSERT INTO categories (name, description) VALUES (?, ?)'
  );
  
  for (const cat of categories) {
    insertCategory.run(cat.name, cat.description);
  }
  console.log(`✅ Inserted ${categories.length} categories`);
  
  // Insert products
  const insertProduct = db.prepare(
    'INSERT INTO products (name, product_code, price, quantity, category_id) VALUES (?, ?, ?, ?, ?)'
  );
  
  for (const prod of products) {
    insertProduct.run(prod.name, prod.code, prod.price, prod.qty, prod.cat);
  }
  console.log(`✅ Inserted ${products.length} products`);
  
  closeDatabase();
  console.log('🌱 Seed completed successfully!');
}

seed().catch(console.error);

