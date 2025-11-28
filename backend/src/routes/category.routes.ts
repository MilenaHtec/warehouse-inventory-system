import { Router } from 'express';
import { categoryController } from '../controllers/category.controller.js';
import { validate } from '../middleware/validate.js';
import { idParamSchema } from '../validators/common.js';
import { createCategorySchema, updateCategorySchema } from '../validators/category.js';

const router = Router();

// GET /api/categories - Get all categories
router.get('/', categoryController.getAll);

// GET /api/categories/:id - Get category by ID
router.get('/:id', 
  validate({ params: idParamSchema }), 
  categoryController.getById
);

// POST /api/categories - Create category
router.post('/', 
  validate({ body: createCategorySchema }), 
  categoryController.create
);

// PUT /api/categories/:id - Update category
router.put('/:id', 
  validate({ params: idParamSchema, body: updateCategorySchema }), 
  categoryController.update
);

// DELETE /api/categories/:id - Delete category
router.delete('/:id', 
  validate({ params: idParamSchema }), 
  categoryController.delete
);

export default router;

