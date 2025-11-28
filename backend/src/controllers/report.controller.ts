import { Request, Response } from 'express';
import { reportService } from '../services/report.service.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// ============================================
// Report Controller
// ============================================

export const reportController = {
  // GET /api/reports/stock-by-category
  getStockByCategory: asyncHandler(async (_req: Request, res: Response) => {
    const data = reportService.getStockByCategory();
    res.json({
      success: true,
      data,
    });
  }),

  // GET /api/reports/low-stock
  getLowStock: asyncHandler(async (req: Request, res: Response) => {
    const threshold = req.query.threshold ? Number(req.query.threshold) : 10;
    const data = reportService.getLowStockProducts(threshold);
    res.json({
      success: true,
      data,
    });
  }),

  // GET /api/reports/dashboard
  getDashboardStats: asyncHandler(async (_req: Request, res: Response) => {
    const data = reportService.getDashboardStats();
    res.json({
      success: true,
      data,
    });
  }),
};

