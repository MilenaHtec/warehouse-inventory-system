import { z } from 'zod';

// ============================================
// Category Validation Schemas
// ============================================

export const createCategorySchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .trim(),
  description: z.string()
    .max(500, 'Description must be at most 500 characters')
    .trim()
    .optional()
    .nullable(),
});

export const updateCategorySchema = z.object({
  name: z.string()
    .min(1, 'Name cannot be empty')
    .max(100, 'Name must be at most 100 characters')
    .trim()
    .optional(),
  description: z.string()
    .max(500, 'Description must be at most 500 characters')
    .trim()
    .optional()
    .nullable(),
}).refine((data) => data.name !== undefined || data.description !== undefined, {
  message: 'At least one field must be provided',
});

// Type exports
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

