import { useQuery } from '@tanstack/react-query';
import { reportsService } from '@/services/reports';

const QUERY_KEY = ['reports'];

export function useDashboardStats() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'dashboard'],
    queryFn: reportsService.getDashboardStats,
  });
}

export function useStockByCategory() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'stock-by-category'],
    queryFn: reportsService.getStockByCategory,
  });
}

export function useLowStock(threshold?: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'low-stock', threshold],
    queryFn: () => reportsService.getLowStock(threshold),
  });
}

