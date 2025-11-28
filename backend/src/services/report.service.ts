import { reportRepository } from '../repositories/report.repository.js';
import type { StockByCategory, LowStockProduct } from '@shared/types/index.js';

// ============================================
// Report Service
// ============================================

export class ReportService {
  getStockByCategory(): StockByCategory[] {
    return reportRepository.getStockByCategory();
  }

  getLowStockProducts(threshold: number = 10): LowStockProduct[] {
    return reportRepository.getLowStockProducts(threshold);
  }

  getDashboardStats(): {
    total_products: number;
    total_categories: number;
    total_stock: number;
    total_value: number;
    low_stock_count: number;
  } {
    return reportRepository.getDashboardStats();
  }
}

// Export singleton instance
export const reportService = new ReportService();

