import { z } from 'zod';
import { paginationFields } from './common.js';

// ============================================
// Inventory Validation Schemas
// ============================================

export const stockChangeSchema = z.object({
  quantity: z.number()
    .int('Quantity must be an integer')
    .positive('Quantity must be positive'),
  reason: z.string()
    .max(500, 'Reason must be at most 500 characters')
    .trim()
    .optional()
    .nullable(),
});

export const stockAdjustSchema = z.object({
  new_quantity: z.number()
    .int('Quantity must be an integer')
    .min(0, 'Quantity cannot be negative'),
  reason: z.string()
    .max(500, 'Reason must be at most 500 characters')
    .trim()
    .optional()
    .nullable(),
});

export const inventoryHistoryFiltersSchema = z.object({
  ...paginationFields,
  change_type: z.enum(['increase', 'decrease', 'adjustment']).optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
});

export const productIdParamSchema = z.object({
  productId: z.string().regex(/^\d+$/, 'Must be a positive integer').transform(Number),
});

// Type exports
export type StockChangeInput = z.infer<typeof stockChangeSchema>;
export type StockAdjustInput = z.infer<typeof stockAdjustSchema>;
export type InventoryHistoryFiltersInput = z.infer<typeof inventoryHistoryFiltersSchema>;
