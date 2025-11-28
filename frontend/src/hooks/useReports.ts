import { useQuery } from '@tanstack/react-query';
import { reportsService } from '@/services/reports';

const QUERY_KEY = ['reports'];

export function useDashboardStats() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'dashboard'],
    queryFn: reportsService.getDashboardStats,
    staleTime: 0, // Always consider stale
    refetchOnMount: 'always', // Always refetch when component mounts
  });
}

export function useStockByCategory() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'stock-by-category'],
    queryFn: reportsService.getStockByCategory,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useLowStock(threshold?: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'low-stock', threshold],
    queryFn: () => reportsService.getLowStock(threshold),
    staleTime: 0,
    refetchOnMount: 'always',
  });
}
