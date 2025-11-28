import { z } from 'zod';

// ============================================
// Common Validation Schemas
// ============================================

// ID parameter validation
export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Must be a positive integer').transform(Number),
});

// Base pagination fields (can be extended)
const paginationFields = {
  page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default('20'),
};

// Pagination query parameters - use this directly
export const paginationSchema = z.object(paginationFields);

// Export fields for extension
export { paginationFields };

// Sort order
export const sortOrderSchema = z.enum(['asc', 'desc']).default('asc');

// Helper to clamp pagination values
export function clampPagination(page?: number, limit?: number) {
  return {
    page: Math.max(1, page || 1),
    limit: Math.min(100, Math.max(1, limit || 20)),
  };
}
