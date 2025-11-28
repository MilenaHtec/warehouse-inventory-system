import { z } from 'zod';
import { paginationFields, sortOrderSchema } from './common.js';

// ============================================
// Product Validation Schemas
// ============================================

export const createProductSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(200, 'Name must be at most 200 characters')
    .trim(),
  product_code: z.string()
    .min(1, 'Product code is required')
    .max(50, 'Product code must be at most 50 characters')
    .trim()
    .toUpperCase(),
  price: z.number()
    .min(0, 'Price must be non-negative')
    .multipleOf(0.01, 'Price can have at most 2 decimal places'),
  quantity: z.number()
    .int('Quantity must be an integer')
    .min(0, 'Quantity must be non-negative')
    .default(0),
  category_id: z.number()
    .int('Category ID must be an integer')
    .positive('Category ID must be positive'),
});

export const updateProductSchema = z.object({
  name: z.string()
    .min(1, 'Name cannot be empty')
    .max(200, 'Name must be at most 200 characters')
    .trim()
    .optional(),
  product_code: z.string()
    .min(1, 'Product code cannot be empty')
    .max(50, 'Product code must be at most 50 characters')
    .trim()
    .toUpperCase()
    .optional(),
  price: z.number()
    .min(0, 'Price must be non-negative')
    .multipleOf(0.01, 'Price can have at most 2 decimal places')
    .optional(),
  category_id: z.number()
    .int('Category ID must be an integer')
    .positive('Category ID must be positive')
    .optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});

export const productFiltersSchema = z.object({
  ...paginationFields,
  category_id: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().trim().optional(),
  sort_by: z.enum(['name', 'price', 'quantity', 'created_at']).optional().default('created_at'),
  sort_order: sortOrderSchema,
});

export const searchProductsSchema = z.object({
  q: z.string().min(1, 'Search query is required').trim(),
});

// Type exports
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductFiltersInput = z.infer<typeof productFiltersSchema>;
