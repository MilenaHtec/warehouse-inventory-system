import { api } from '@/lib/api';
import type { 
  Product,
  ProductWithCategory, 
  CreateProductDTO, 
  UpdateProductDTO,
  ProductFilters,
  ApiResponse,
  PaginatedResponse 
} from '@shared/types';

const BASE_URL = '/products';

export const productsService = {
  async getAll(filters?: ProductFilters): Promise<PaginatedResponse<ProductWithCategory>> {
    const response = await api.get<PaginatedResponse<ProductWithCategory>>(BASE_URL, { 
      params: filters 
    });
    return response.data;
  },

  async getById(id: number): Promise<ProductWithCategory> {
    const response = await api.get<ApiResponse<ProductWithCategory>>(`${BASE_URL}/${id}`);
    return response.data.data;
  },

  async search(query: string): Promise<ProductWithCategory[]> {
    const response = await api.get<ApiResponse<ProductWithCategory[]>>(`${BASE_URL}/search`, {
      params: { q: query }
    });
    return response.data.data;
  },

  async create(data: CreateProductDTO): Promise<Product> {
    const response = await api.post<ApiResponse<Product>>(BASE_URL, data);
    return response.data.data;
  },

  async update(id: number, data: UpdateProductDTO): Promise<Product> {
    const response = await api.put<ApiResponse<Product>>(`${BASE_URL}/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${BASE_URL}/${id}`);
  },
};

