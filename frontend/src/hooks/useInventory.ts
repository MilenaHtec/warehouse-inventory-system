import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { inventoryService } from '@/services/inventory';
import type { StockChangeDTO, StockAdjustDTO, InventoryHistoryFilters } from '@shared/types';

const QUERY_KEY = ['inventory'];
const PRODUCTS_KEY = ['products'];

export function useInventoryHistory(filters?: InventoryHistoryFilters) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'history', filters],
    queryFn: () => inventoryService.getAllHistory(filters),
  });
}

export function useProductInventoryHistory(productId: number, filters?: InventoryHistoryFilters) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'history', productId, filters],
    queryFn: () => inventoryService.getProductHistory(productId, filters),
    enabled: !!productId,
  });
}

export function useIncreaseStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, data }: { productId: number; data: StockChangeDTO }) =>
      inventoryService.increaseStock(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      toast.success('Stock increased successfully');
    },
  });
}

export function useDecreaseStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, data }: { productId: number; data: StockChangeDTO }) =>
      inventoryService.decreaseStock(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      toast.success('Stock decreased successfully');
    },
  });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, data }: { productId: number; data: StockAdjustDTO }) =>
      inventoryService.adjustStock(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      toast.success('Stock adjusted successfully');
    },
  });
}

