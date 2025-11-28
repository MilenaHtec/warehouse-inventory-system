import { api } from '@/lib/api';
import type { 
  InventoryHistory,
  InventoryHistoryWithProduct,
  StockChangeDTO,
  StockAdjustDTO,
  InventoryHistoryFilters,
  ApiResponse,
  PaginatedResponse 
} from '@shared/types';

const BASE_URL = '/inventory';

export const inventoryService = {
  async increaseStock(productId: number, data: StockChangeDTO): Promise<InventoryHistory> {
    const response = await api.post<ApiResponse<InventoryHistory>>(
      `${BASE_URL}/${productId}/increase`, 
      data
    );
    return response.data.data;
  },

  async decreaseStock(productId: number, data: StockChangeDTO): Promise<InventoryHistory> {
    const response = await api.post<ApiResponse<InventoryHistory>>(
      `${BASE_URL}/${productId}/decrease`, 
      data
    );
    return response.data.data;
  },

  async adjustStock(productId: number, data: StockAdjustDTO): Promise<InventoryHistory> {
    const response = await api.post<ApiResponse<InventoryHistory>>(
      `${BASE_URL}/${productId}/adjust`, 
      data
    );
    return response.data.data;
  },

  async getProductHistory(
    productId: number, 
    filters?: InventoryHistoryFilters
  ): Promise<PaginatedResponse<InventoryHistoryWithProduct>> {
    const response = await api.get<PaginatedResponse<InventoryHistoryWithProduct>>(
      `${BASE_URL}/${productId}/history`,
      { params: filters }
    );
    return response.data;
  },

  async getAllHistory(
    filters?: InventoryHistoryFilters
  ): Promise<PaginatedResponse<InventoryHistoryWithProduct>> {
    const response = await api.get<PaginatedResponse<InventoryHistoryWithProduct>>(
      `${BASE_URL}/history`,
      { params: filters }
    );
    return response.data;
  },
};

