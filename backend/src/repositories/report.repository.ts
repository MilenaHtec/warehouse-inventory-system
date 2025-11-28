import { getDatabase } from '../config/database.js';
import type { StockByCategory, LowStockProduct } from '@shared/types/index.js';

// ============================================
// Report Repository
// ============================================

export class ReportRepository {
  private db = getDatabase();

  getStockByCategory(): StockByCategory[] {
    const stmt = this.db.prepare(`
      SELECT 
        c.id as category_id,
        c.name as category_name,
        COUNT(p.id) as total_products,
        COALESCE(SUM(p.quantity), 0) as total_stock,
        COALESCE(SUM(p.quantity * p.price), 0) as total_value
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id
      ORDER BY c.name ASC
    `);
    return stmt.all() as StockByCategory[];
  }

  getLowStockProducts(threshold: number): LowStockProduct[] {
    const stmt = this.db.prepare(`
      SELECT 
        p.id,
        p.name,
        p.product_code,
        p.quantity,
        c.name as category_name
      FROM products p
      JOIN categories c ON c.id = p.category_id
      WHERE p.quantity <= ?
      ORDER BY p.quantity ASC, p.name ASC
    `);
    return stmt.all(threshold) as LowStockProduct[];
  }

  getDashboardStats(): {
    total_products: number;
    total_categories: number;
    total_stock: number;
    total_value: number;
    low_stock_count: number;
  } {
    const stmt = this.db.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM products) as total_products,
        (SELECT COUNT(*) FROM categories) as total_categories,
        (SELECT COALESCE(SUM(quantity), 0) FROM products) as total_stock,
        (SELECT COALESCE(SUM(quantity * price), 0) FROM products) as total_value,
        (SELECT COUNT(*) FROM products WHERE quantity <= 10) as low_stock_count
    `);
    return stmt.get() as {
      total_products: number;
      total_categories: number;
      total_stock: number;
      total_value: number;
      low_stock_count: number;
    };
  }
}

// Export singleton instance
export const reportRepository = new ReportRepository();

