import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { productsService } from '@/services/products';
import type { CreateProductDTO, UpdateProductDTO, ProductFilters } from '@shared/types';

const QUERY_KEY = ['products'];

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: [...QUERY_KEY, filters],
    queryFn: () => productsService.getAll(filters),
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => productsService.getById(id),
    enabled: !!id,
  });
}

export function useProductSearch(query: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'search', query],
    queryFn: () => productsService.search(query),
    enabled: query.length >= 2,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductDTO) => productsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Product created successfully');
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductDTO }) =>
      productsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Product updated successfully');
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Product deleted successfully');
    },
  });
}

