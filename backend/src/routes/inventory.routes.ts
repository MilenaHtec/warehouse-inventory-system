import { Router } from 'express';
import { inventoryController } from '../controllers/inventory.controller.js';
import { validate } from '../middleware/validate.js';
import { 
  stockChangeSchema, 
  stockAdjustSchema,
  inventoryHistoryFiltersSchema,
  productIdParamSchema 
} from '../validators/inventory.js';

const router = Router();

// GET /api/inventory/history - Get all inventory history
router.get('/history', 
  validate({ query: inventoryHistoryFiltersSchema }), 
  inventoryController.getAllHistory
);

// POST /api/inventory/:productId/increase - Increase stock
router.post('/:productId/increase', 
  validate({ params: productIdParamSchema, body: stockChangeSchema }), 
  inventoryController.increaseStock
);

// POST /api/inventory/:productId/decrease - Decrease stock
router.post('/:productId/decrease', 
  validate({ params: productIdParamSchema, body: stockChangeSchema }), 
  inventoryController.decreaseStock
);

// POST /api/inventory/:productId/adjust - Adjust stock
router.post('/:productId/adjust', 
  validate({ params: productIdParamSchema, body: stockAdjustSchema }), 
  inventoryController.adjustStock
);

// GET /api/inventory/:productId/history - Get product inventory history
router.get('/:productId/history', 
  validate({ params: productIdParamSchema, query: inventoryHistoryFiltersSchema }), 
  inventoryController.getProductHistory
);

export default router;

