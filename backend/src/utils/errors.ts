// ============================================
// Custom Error Classes
// ============================================

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public readonly details: Record<string, string[]>;

  constructor(message: string, details: Record<string, string[]> = {}) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string | number) {
    const message = identifier 
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
  }
}

export class BusinessError extends AppError {
  constructor(message: string, code: string) {
    super(message, 422, code);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, 'DATABASE_ERROR');
  }
}

// ============================================
// Error Factory - Predefined errors
// ============================================

export const Errors = {
  // Category errors
  categoryNotFound: (id: number) => new NotFoundError('Category', id),
  categoryNameExists: (name: string) => 
    new ConflictError(`Category with name '${name}' already exists`),
  categoryHasProducts: () => 
    new BusinessError('Cannot delete category that has products', 'CATEGORY_HAS_PRODUCTS'),

  // Product errors
  productNotFound: (id: number) => new NotFoundError('Product', id),
  productCodeExists: (code: string) => 
    new ConflictError(`Product with code '${code}' already exists`),

  // Inventory errors
  insufficientStock: (available: number, requested: number) =>
    new BusinessError(
      `Insufficient stock. Available: ${available}, Requested: ${requested}`,
      'INSUFFICIENT_STOCK'
    ),
  invalidQuantity: () =>
    new ValidationError('Quantity must be a positive number', {
      quantity: ['Must be greater than 0']
    }),
  negativeStockNotAllowed: () =>
    new BusinessError('Stock cannot go below zero', 'NEGATIVE_STOCK'),

  // General errors
  invalidId: () => new ValidationError('Invalid ID format', { id: ['Must be a positive integer'] }),
  internal: (message?: string) => new AppError(message || 'Internal server error', 500),
} as const;

