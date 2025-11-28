import { Request, Response } from 'express';
import { productService } from '../services/product.service.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// ============================================
// Product Controller
// ============================================

export const productController = {
  // GET /api/products
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const result = productService.getAll(req.query as any);
    res.json(result);
  }),

  // GET /api/products/search
  search: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query.q as string;
    const products = productService.search(query);
    res.json({
      success: true,
      data: products,
    });
  }),

  // GET /api/products/:id
  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const product = productService.getById(id);
    res.json({
      success: true,
      data: product,
    });
  }),

  // POST /api/products
  create: asyncHandler(async (req: Request, res: Response) => {
    const product = productService.create(req.body);
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully',
    });
  }),

  // PUT /api/products/:id
  update: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const product = productService.update(id, req.body);
    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully',
    });
  }),

  // DELETE /api/products/:id
  delete: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    productService.delete(id);
    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  }),
};

