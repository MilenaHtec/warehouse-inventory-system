import { Request, Response } from 'express';
import { inventoryService } from '../services/inventory.service.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// ============================================
// Inventory Controller
// ============================================

export const inventoryController = {
  // POST /api/inventory/:productId/increase
  increaseStock: asyncHandler(async (req: Request, res: Response) => {
    const productId = Number(req.params.productId);
    const result = inventoryService.increaseStock(productId, req.body);
    res.status(201).json({
      success: true,
      data: result,
      message: 'Stock increased successfully',
    });
  }),

  // POST /api/inventory/:productId/decrease
  decreaseStock: asyncHandler(async (req: Request, res: Response) => {
    const productId = Number(req.params.productId);
    const result = inventoryService.decreaseStock(productId, req.body);
    res.status(201).json({
      success: true,
      data: result,
      message: 'Stock decreased successfully',
    });
  }),

  // POST /api/inventory/:productId/adjust
  adjustStock: asyncHandler(async (req: Request, res: Response) => {
    const productId = Number(req.params.productId);
    const result = inventoryService.adjustStock(productId, req.body);
    res.status(201).json({
      success: true,
      data: result,
      message: 'Stock adjusted successfully',
    });
  }),

  // GET /api/inventory/:productId/history
  getProductHistory: asyncHandler(async (req: Request, res: Response) => {
    const productId = Number(req.params.productId);
    const result = inventoryService.getHistory(productId, req.query as any);
    res.json(result);
  }),

  // GET /api/inventory/history
  getAllHistory: asyncHandler(async (req: Request, res: Response) => {
    const result = inventoryService.getAllHistory(req.query as any);
    res.json(result);
  }),
};

