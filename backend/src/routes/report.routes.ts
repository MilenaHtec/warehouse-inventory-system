import { Router } from 'express';
import { reportController } from '../controllers/report.controller.js';

const router = Router();

// GET /api/reports/dashboard - Get dashboard stats
router.get('/dashboard', reportController.getDashboardStats);

// GET /api/reports/stock-by-category - Get stock grouped by category
router.get('/stock-by-category', reportController.getStockByCategory);

// GET /api/reports/low-stock - Get low stock products
router.get('/low-stock', reportController.getLowStock);

export default router;

