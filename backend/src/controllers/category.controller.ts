import { Request, Response } from 'express';
import { categoryService } from '../services/category.service.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// ============================================
// Category Controller
// ============================================

export const categoryController = {
  // GET /api/categories
  getAll: asyncHandler(async (_req: Request, res: Response) => {
    const categories = categoryService.getAll();
    res.json({
      success: true,
      data: categories,
    });
  }),

  // GET /api/categories/:id
  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const category = categoryService.getById(id);
    res.json({
      success: true,
      data: category,
    });
  }),

  // POST /api/categories
  create: asyncHandler(async (req: Request, res: Response) => {
    const category = categoryService.create(req.body);
    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully',
    });
  }),

  // PUT /api/categories/:id
  update: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const category = categoryService.update(id, req.body);
    res.json({
      success: true,
      data: category,
      message: 'Category updated successfully',
    });
  }),

  // DELETE /api/categories/:id
  delete: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    categoryService.delete(id);
    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  }),
};

