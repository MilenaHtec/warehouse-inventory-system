import { z } from 'zod';

// ============================================
// Common Validation Schemas
// ============================================

// ID parameter validation
export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Must be a positive integer').transform(Number),
});

// Pagination query parameters
export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('20'),
}).transform((data) => ({
  page: Math.max(1, data.page),
  limit: Math.min(100, Math.max(1, data.limit)),
}));

// Sort order
export const sortOrderSchema = z.enum(['asc', 'desc']).default('asc');

