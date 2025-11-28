import { getDatabase } from '../config/database.js';
import type { 
  InventoryHistory, 
  InventoryHistoryWithProduct,
  ChangeType,
  InventoryHistoryFilters 
} from '@shared/types/index.js';

// ============================================
// Inventory (Audit) Repository
// ============================================

export class InventoryRepository {
  private db = getDatabase();

  logChange(data: {
    product_id: number;
    change_type: ChangeType;
    quantity_change: number;
    quantity_before: number;
    quantity_after: number;
    reason?: string | null;
  }): InventoryHistory {
    const stmt = this.db.prepare(`
      INSERT INTO inventory_history 
        (product_id, change_type, quantity_change, quantity_before, quantity_after, reason)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      data.product_id,
      data.change_type,
      data.quantity_change,
      data.quantity_before,
      data.quantity_after,
      data.reason || null
    );
    
    return this.findById(result.lastInsertRowid as number)!;
  }

  findById(id: number): InventoryHistory | undefined {
    const stmt = this.db.prepare('SELECT * FROM inventory_history WHERE id = ?');
    return stmt.get(id) as InventoryHistory | undefined;
  }

  findByProductId(
    productId: number,
    filters: InventoryHistoryFilters
  ): { history: InventoryHistoryWithProduct[]; total: number } {
    return this.findAll({ ...filters, product_id: productId });
  }

  findAll(
    filters: InventoryHistoryFilters & { product_id?: number }
  ): { history: InventoryHistoryWithProduct[]; total: number } {
    const { 
      page = 1, 
      limit = 20, 
      product_id,
      change_type, 
      start_date, 
      end_date 
    } = filters;
    const offset = (page - 1) * limit;

    // Build WHERE clause
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (product_id) {
      conditions.push('ih.product_id = ?');
      params.push(product_id);
    }

    if (change_type) {
      conditions.push('ih.change_type = ?');
      params.push(change_type);
    }

    if (start_date) {
      conditions.push('ih.created_at >= ?');
      params.push(start_date);
    }

    if (end_date) {
      conditions.push('ih.created_at <= ?');
      params.push(end_date);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countStmt = this.db.prepare(`
      SELECT COUNT(*) as total FROM inventory_history ih ${whereClause}
    `);
    const { total } = countStmt.get(...params) as { total: number };

    // Get history entries
    const stmt = this.db.prepare(`
      SELECT 
        ih.*,
        p.name as product_name,
        p.product_code
      FROM inventory_history ih
      JOIN products p ON p.id = ih.product_id
      ${whereClause}
      ORDER BY ih.created_at DESC
      LIMIT ? OFFSET ?
    `);

    const history = stmt.all(...params, limit, offset) as InventoryHistoryWithProduct[];

    return { history, total };
  }
}

// Export singleton instance
export const inventoryRepository = new InventoryRepository();

