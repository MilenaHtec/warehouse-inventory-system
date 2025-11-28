// ============================================
// SHARED TYPES - Used by both Backend and Frontend
// ============================================

// ============================================
// Category Types
// ============================================

export interface Category {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryWithProductCount extends Category {
  product_count: number;
}

export interface CreateCategoryDTO {
  name: string;
  description?: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  description?: string;
}

// ============================================
// Product Types
// ============================================

export interface Product {
  id: number;
  name: string;
  product_code: string;
  price: number;
  quantity: number;
  category_id: number;
  created_at: string;
  updated_at: string;
}

export interface ProductWithCategory extends Product {
  category_name: string;
}

export interface CreateProductDTO {
  name: string;
  product_code: string;
  price: number;
  quantity?: number;
  category_id: number;
}

export interface UpdateProductDTO {
  name?: string;
  product_code?: string;
  price?: number;
  category_id?: number;
}

// ============================================
// Inventory Types
// ============================================

export type ChangeType = 'increase' | 'decrease' | 'adjustment';

export interface InventoryHistory {
  id: number;
  product_id: number;
  change_type: ChangeType;
  quantity_change: number;
  quantity_before: number;
  quantity_after: number;
  reason: string | null;
  created_at: string;
}

export interface InventoryHistoryWithProduct extends InventoryHistory {
  product_name: string;
  product_code: string;
}

export interface StockChangeDTO {
  quantity: number;
  reason?: string;
}

export interface StockAdjustDTO {
  new_quantity: number;
  reason?: string;
}

// ============================================
// Report Types
// ============================================

export interface StockByCategory {
  category_id: number;
  category_name: string;
  total_products: number;
  total_stock: number;
  total_value: number;
}

export interface LowStockProduct {
  id: number;
  name: string;
  product_code: string;
  quantity: number;
  category_name: string;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// ============================================
// Query Parameters
// ============================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ProductFilters extends PaginationParams {
  category_id?: number;
  search?: string;
  sort_by?: 'name' | 'price' | 'quantity' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface InventoryHistoryFilters extends PaginationParams {
  product_id?: number;
  change_type?: ChangeType;
  start_date?: string;
  end_date?: string;
}

