import { getDatabase } from '../config/database.js';
import type { Category, CategoryWithProductCount } from '@shared/types/index.js';

// ============================================
// Category Repository
// ============================================

export class CategoryRepository {
  private db = getDatabase();

  findAll(): CategoryWithProductCount[] {
    const stmt = this.db.prepare(`
      SELECT 
        c.*,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id
      ORDER BY c.name ASC
    `);
    return stmt.all() as CategoryWithProductCount[];
  }

  findById(id: number): Category | undefined {
    const stmt = this.db.prepare('SELECT * FROM categories WHERE id = ?');
    return stmt.get(id) as Category | undefined;
  }

  findByName(name: string): Category | undefined {
    const stmt = this.db.prepare('SELECT * FROM categories WHERE LOWER(name) = LOWER(?)');
    return stmt.get(name) as Category | undefined;
  }

  create(data: { name: string; description?: string | null }): Category {
    const stmt = this.db.prepare(`
      INSERT INTO categories (name, description)
      VALUES (?, ?)
    `);
    const result = stmt.run(data.name, data.description || null);
    return this.findById(result.lastInsertRowid as number)!;
  }

  update(id: number, data: { name?: string; description?: string | null }): Category | undefined {
    const fields: string[] = [];
    const values: (string | null)[] = [];

    if (data.name !== undefined) {
      fields.push('name = ?');
      values.push(data.name);
    }
    if (data.description !== undefined) {
      fields.push('description = ?');
      values.push(data.description);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id.toString());

    const stmt = this.db.prepare(`
      UPDATE categories SET ${fields.join(', ')} WHERE id = ?
    `);
    stmt.run(...values.slice(0, -1), id);
    
    return this.findById(id);
  }

  delete(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM categories WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  getProductCount(id: number): number {
    const stmt = this.db.prepare('SELECT COUNT(*) as count FROM products WHERE category_id = ?');
    const result = stmt.get(id) as { count: number };
    return result.count;
  }
}

// Export singleton instance
export const categoryRepository = new CategoryRepository();

