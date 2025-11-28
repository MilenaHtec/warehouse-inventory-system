import { api } from '@/lib/api';
import type { 
  StockByCategory, 
  LowStockProduct,
  ApiResponse 
} from '@shared/types';

const BASE_URL = '/reports';

interface DashboardStats {
  total_products: number;
  total_categories: number;
  total_stock: number;
  total_value: number;
  low_stock_count: number;
}

export const reportsService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get<ApiResponse<DashboardStats>>(`${BASE_URL}/dashboard`);
    return response.data.data;
  },

  async getStockByCategory(): Promise<StockByCategory[]> {
    const response = await api.get<ApiResponse<StockByCategory[]>>(`${BASE_URL}/stock-by-category`);
    return response.data.data;
  },

  async getLowStock(threshold?: number): Promise<LowStockProduct[]> {
    const response = await api.get<ApiResponse<LowStockProduct[]>>(`${BASE_URL}/low-stock`, {
      params: threshold ? { threshold } : undefined
    });
    return response.data.data;
  },
};

