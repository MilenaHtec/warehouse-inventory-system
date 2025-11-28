import { api } from '@/lib/api';
import type { 
  Category, 
  CategoryWithProductCount, 
  CreateCategoryDTO, 
  UpdateCategoryDTO,
  ApiResponse 
} from '@shared/types';

const BASE_URL = '/categories';

export const categoriesService = {
  async getAll(): Promise<CategoryWithProductCount[]> {
    const response = await api.get<ApiResponse<CategoryWithProductCount[]>>(BASE_URL);
    return response.data.data;
  },

  async getById(id: number): Promise<Category> {
    const response = await api.get<ApiResponse<Category>>(`${BASE_URL}/${id}`);
    return response.data.data;
  },

  async create(data: CreateCategoryDTO): Promise<Category> {
    const response = await api.post<ApiResponse<Category>>(BASE_URL, data);
    return response.data.data;
  },

  async update(id: number, data: UpdateCategoryDTO): Promise<Category> {
    const response = await api.put<ApiResponse<Category>>(`${BASE_URL}/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${BASE_URL}/${id}`);
  },
};

