import { getDatabase } from '../config/database.js';
import type { Product, ProductWithCategory, ProductFilters } from '@shared/types/index.js';

// ============================================
// Product Repository
// ============================================

export class ProductRepository {
  private db = getDatabase();

  findAll(filters: ProductFilters): { products: ProductWithCategory[]; total: number } {
    const { page = 1, limit = 20, category_id, search, sort_by = 'created_at', sort_order = 'desc' } = filters;
    const offset = (page - 1) * limit;

    // Build WHERE clause
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (category_id) {
      conditions.push('p.category_id = ?');
      params.push(category_id);
    }

    if (search) {
      conditions.push('(p.name LIKE ? OR p.product_code LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Validate sort column
    const validSortColumns = ['name', 'price', 'quantity', 'created_at'];
    const sortColumn = validSortColumns.includes(sort_by) ? sort_by : 'created_at';
    const sortDir = sort_order === 'asc' ? 'ASC' : 'DESC';

    // Get total count
    const countStmt = this.db.prepare(`
      SELECT COUNT(*) as total FROM products p ${whereClause}
    `);
    const { total } = countStmt.get(...params) as { total: number };

    // Get products
    const stmt = this.db.prepare(`
      SELECT 
        p.*,
        c.name as category_name
      FROM products p
      JOIN categories c ON c.id = p.category_id
      ${whereClause}
      ORDER BY p.${sortColumn} ${sortDir}
      LIMIT ? OFFSET ?
    `);

    const products = stmt.all(...params, limit, offset) as ProductWithCategory[];

    return { products, total };
  }

  findById(id: number): ProductWithCategory | undefined {
    const stmt = this.db.prepare(`
      SELECT 
        p.*,
        c.name as category_name
      FROM products p
      JOIN categories c ON c.id = p.category_id
      WHERE p.id = ?
    `);
    return stmt.get(id) as ProductWithCategory | undefined;
  }

  findByCode(code: string): Product | undefined {
    const stmt = this.db.prepare('SELECT * FROM products WHERE product_code = ?');
    return stmt.get(code) as Product | undefined;
  }

  search(query: string, limit: number = 10): ProductWithCategory[] {
    const stmt = this.db.prepare(`
      SELECT 
        p.*,
        c.name as category_name
      FROM products p
      JOIN categories c ON c.id = p.category_id
      WHERE p.name LIKE ? OR p.product_code LIKE ?
      ORDER BY 
        CASE 
          WHEN p.product_code LIKE ? THEN 1
          WHEN p.name LIKE ? THEN 2
          ELSE 3
        END
      LIMIT ?
    `);
    const searchPattern = `%${query}%`;
    const startPattern = `${query}%`;
    return stmt.all(searchPattern, searchPattern, startPattern, startPattern, limit) as ProductWithCategory[];
  }

  create(data: {
    name: string;
    product_code: string;
    price: number;
    quantity: number;
    category_id: number;
  }): Product {
    const stmt = this.db.prepare(`
      INSERT INTO products (name, product_code, price, quantity, category_id)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      data.name,
      data.product_code,
      data.price,
      data.quantity,
      data.category_id
    );
    return this.findById(result.lastInsertRowid as number)!;
  }

  update(id: number, data: {
    name?: string;
    product_code?: string;
    price?: number;
    category_id?: number;
  }): Product | undefined {
    const fields: string[] = [];
    const values: (string | number)[] = [];

    if (data.name !== undefined) {
      fields.push('name = ?');
      values.push(data.name);
    }
    if (data.product_code !== undefined) {
      fields.push('product_code = ?');
      values.push(data.product_code);
    }
    if (data.price !== undefined) {
      fields.push('price = ?');
      values.push(data.price);
    }
    if (data.category_id !== undefined) {
      fields.push('category_id = ?');
      values.push(data.category_id);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = CURRENT_TIMESTAMP');

    const stmt = this.db.prepare(`
      UPDATE products SET ${fields.join(', ')} WHERE id = ?
    `);
    stmt.run(...values, id);
    
    return this.findById(id);
  }

  updateQuantity(id: number, quantity: number): boolean {
    const stmt = this.db.prepare(`
      UPDATE products SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `);
    const result = stmt.run(quantity, id);
    return result.changes > 0;
  }

  delete(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM products WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

// Export singleton instance
export const productRepository = new ProductRepository();

