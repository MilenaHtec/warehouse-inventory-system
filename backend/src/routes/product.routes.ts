import { Router } from 'express';
import { productController } from '../controllers/product.controller.js';
import { validate } from '../middleware/validate.js';
import { idParamSchema } from '../validators/common.js';
import { 
  createProductSchema, 
  updateProductSchema, 
  productFiltersSchema,
  searchProductsSchema 
} from '../validators/product.js';

const router = Router();

// GET /api/products/search - Search products (must come before :id)
router.get('/search', 
  validate({ query: searchProductsSchema }), 
  productController.search
);

// GET /api/products - Get all products with filters
router.get('/', 
  validate({ query: productFiltersSchema }), 
  productController.getAll
);

// GET /api/products/:id - Get product by ID
router.get('/:id', 
  validate({ params: idParamSchema }), 
  productController.getById
);

// POST /api/products - Create product
router.post('/', 
  validate({ body: createProductSchema }), 
  productController.create
);

// PUT /api/products/:id - Update product
router.put('/:id', 
  validate({ params: idParamSchema, body: updateProductSchema }), 
  productController.update
);

// DELETE /api/products/:id - Delete product
router.delete('/:id', 
  validate({ params: idParamSchema }), 
  productController.delete
);

export default router;

