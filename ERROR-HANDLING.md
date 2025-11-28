# Error Handling Specification

## Overview

This document defines the error handling strategy for the Warehouse Inventory System. It covers error types, error codes, response formats, and implementation guidelines.

---

## Error Handling Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Request Flow                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Request → Middleware → Controller → Service → Repository → Database      │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                     Error Propagation                                │  │
│   │                                                                      │  │
│   │   Database Error ──┐                                                 │  │
│   │                    │                                                 │  │
│   │   Repository ──────┼──► Service ──► Controller ──► Error Handler    │  │
│   │                    │                                                 │  │
│   │   Validation ──────┘                                                 │  │
│   │                                                                      │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│                              ▼                                              │
│                     Global Error Handler                                    │
│                              ▼                                              │
│                     Formatted Response                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Error Response Format

### Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [],
    "stack": "..." 
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "requestId": "req-abc123"
  }
}
```

| Field          | Type     | Description                                    |
| -------------- | -------- | ---------------------------------------------- |
| success        | boolean  | Always `false` for errors                      |
| error.code     | string   | Machine-readable error code                    |
| error.message  | string   | Human-readable error description               |
| error.details  | array    | Additional error details (e.g., validation)    |
| error.stack    | string   | Stack trace (development only)                 |
| meta.timestamp | string   | ISO 8601 timestamp                             |
| meta.requestId | string   | Unique request identifier for tracing          |

---

## Error Classes Hierarchy

```typescript
// Base Application Error
AppError
├── ValidationError (400)
│   └── InvalidInputError
├── NotFoundError (404)
│   ├── ProductNotFoundError
│   └── CategoryNotFoundError
├── ConflictError (409)
│   ├── DuplicateProductCodeError
│   ├── DuplicateCategoryNameError
│   └── CategoryHasProductsError
├── BusinessError (400)
│   └── InsufficientStockError
└── DatabaseError (500)
```

---

## Error Codes Reference

### Validation Errors (400)

| Code                    | Message                                      | Scenario                          |
| ----------------------- | -------------------------------------------- | --------------------------------- |
| `VALIDATION_ERROR`      | Invalid input data                           | General validation failure        |
| `INVALID_ID`            | Invalid ID format                            | Non-numeric or negative ID        |
| `INVALID_QUANTITY`      | Quantity must be a positive integer          | Invalid quantity value            |
| `INVALID_PRICE`         | Price must be a non-negative number          | Negative or invalid price         |
| `MISSING_REQUIRED_FIELD`| Field '{field}' is required                  | Required field missing            |
| `INVALID_DATE_FORMAT`   | Invalid date format. Use ISO 8601            | Bad date parameter                |
| `INVALID_SORT_FIELD`    | Invalid sort field '{field}'                 | Unknown sort field                |
| `INVALID_FILTER_VALUE`  | Invalid value for filter '{filter}'          | Bad filter parameter              |

### Not Found Errors (404)

| Code                    | Message                                      | Scenario                          |
| ----------------------- | -------------------------------------------- | --------------------------------- |
| `PRODUCT_NOT_FOUND`     | Product with ID {id} not found               | Product doesn't exist             |
| `CATEGORY_NOT_FOUND`    | Category with ID {id} not found              | Category doesn't exist            |
| `RESOURCE_NOT_FOUND`    | Requested resource not found                 | Generic not found                 |

### Conflict Errors (409)

| Code                      | Message                                    | Scenario                          |
| ------------------------- | ------------------------------------------ | --------------------------------- |
| `DUPLICATE_PRODUCT_CODE`  | Product with code '{code}' already exists  | Product code not unique           |
| `DUPLICATE_CATEGORY_NAME` | Category with name '{name}' already exists | Category name not unique          |
| `CATEGORY_HAS_PRODUCTS`   | Cannot delete category with existing products | Delete category with products  |
| `PRODUCT_IN_USE`          | Product cannot be deleted due to dependencies | Delete product with history    |

### Business Logic Errors (400)

| Code                    | Message                                      | Scenario                          |
| ----------------------- | -------------------------------------------- | --------------------------------- |
| `INSUFFICIENT_STOCK`    | Cannot decrease stock by {qty}. Current: {current} | Stock decrease exceeds available |
| `NEGATIVE_STOCK`        | Stock quantity cannot be negative            | Would result in negative stock    |
| `INVALID_STOCK_OPERATION`| Invalid stock operation                     | Bad stock change request          |

### Server Errors (500)

| Code                    | Message                                      | Scenario                          |
| ----------------------- | -------------------------------------------- | --------------------------------- |
| `INTERNAL_ERROR`        | An unexpected error occurred                 | Unhandled exception               |
| `DATABASE_ERROR`        | Database operation failed                    | DB connection or query error      |
| `SERVICE_UNAVAILABLE`   | Service temporarily unavailable              | System overload or maintenance    |

### Rate Limiting (429)

| Code                    | Message                                      | Scenario                          |
| ----------------------- | -------------------------------------------- | --------------------------------- |
| `RATE_LIMIT_EXCEEDED`   | Too many requests. Try again later.          | Request limit exceeded            |

---

## Custom Error Classes

### Base Error Class

```typescript
// src/utils/errors.ts

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details: unknown[];
  public readonly isOperational: boolean;

  constructor(
    code: string,
    message: string,
    statusCode: number = 500,
    details: unknown[] = [],
    isOperational: boolean = true
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
```

### Specific Error Classes

```typescript
// Validation Error (400)
export class ValidationError extends AppError {
  constructor(message: string, details: ValidationDetail[] = []) {
    super('VALIDATION_ERROR', message, 400, details);
  }
}

// Not Found Error (404)
export class NotFoundError extends AppError {
  constructor(resource: string, identifier: string | number) {
    super(
      `${resource.toUpperCase()}_NOT_FOUND`,
      `${resource} with ID ${identifier} not found`,
      404
    );
  }
}

// Conflict Error (409)
export class ConflictError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, 409);
  }
}

// Business Error (400)
export class BusinessError extends AppError {
  constructor(code: string, message: string, details: unknown[] = []) {
    super(code, message, 400, details);
  }
}

// Database Error (500)
export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super('DATABASE_ERROR', message, 500, [], false);
  }
}
```

### Error Factory Functions

```typescript
// src/utils/errors.ts

export const Errors = {
  // Product errors
  productNotFound: (id: number) => 
    new NotFoundError('Product', id),
  
  duplicateProductCode: (code: string) =>
    new ConflictError('DUPLICATE_PRODUCT_CODE', `Product with code '${code}' already exists`),
  
  // Category errors
  categoryNotFound: (id: number) =>
    new NotFoundError('Category', id),
  
  duplicateCategoryName: (name: string) =>
    new ConflictError('DUPLICATE_CATEGORY_NAME', `Category with name '${name}' already exists`),
  
  categoryHasProducts: (count: number) =>
    new ConflictError('CATEGORY_HAS_PRODUCTS', `Cannot delete category with ${count} existing products`),
  
  // Stock errors
  insufficientStock: (requested: number, available: number) =>
    new BusinessError('INSUFFICIENT_STOCK', `Cannot decrease stock by ${requested}. Current quantity is ${available}.`),
  
  // Validation errors
  validation: (details: ValidationDetail[]) =>
    new ValidationError('Invalid input data', details),
};
```

---

## Global Error Handler Middleware

```typescript
// src/middleware/error-handler.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown[];
    stack?: string;
  };
  meta: {
    timestamp: string;
    requestId?: string;
  };
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    requestId: req.id,
  });

  // Determine if it's an operational error
  const isOperational = err instanceof AppError && err.isOperational;

  // Build error response
  const response: ErrorResponse = {
    success: false,
    error: {
      code: err instanceof AppError ? err.code : 'INTERNAL_ERROR',
      message: isOperational ? err.message : 'An unexpected error occurred',
      details: err instanceof AppError ? err.details : undefined,
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.id,
    },
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = err.stack;
  }

  // Determine status code
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  res.status(statusCode).json(response);
};
```

---

## Validation Error Handling

### Zod Integration

```typescript
// src/middleware/validation.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { ValidationError } from '../utils/errors';

interface ValidationDetail {
  field: string;
  message: string;
}

const formatZodError = (error: ZodError): ValidationDetail[] => {
  return error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
};

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = formatZodError(error);
        next(new ValidationError('Invalid input data', details));
      } else {
        next(error);
      }
    }
  };
};
```

### Validation Schemas

```typescript
// src/validators/product.validator.ts

import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(1, 'Name cannot be empty')
      .max(200, 'Name cannot exceed 200 characters'),
    productCode: z
      .string({ required_error: 'Product code is required' })
      .min(1, 'Product code cannot be empty')
      .max(50, 'Product code cannot exceed 50 characters'),
    price: z
      .number({ required_error: 'Price is required' })
      .min(0, 'Price must be non-negative'),
    quantity: z
      .number()
      .int('Quantity must be an integer')
      .min(0, 'Quantity must be non-negative')
      .default(0),
    categoryId: z
      .number({ required_error: 'Category ID is required' })
      .int('Category ID must be an integer')
      .positive('Category ID must be positive'),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid product ID'),
  }),
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    productCode: z.string().min(1).max(50).optional(),
    price: z.number().min(0).optional(),
    categoryId: z.number().int().positive().optional(),
  }),
});

export const stockChangeSchema = z.object({
  params: z.object({
    productId: z.string().regex(/^\d+$/, 'Invalid product ID'),
  }),
  body: z.object({
    quantity: z
      .number({ required_error: 'Quantity is required' })
      .int('Quantity must be an integer')
      .positive('Quantity must be positive'),
    reason: z.string().max(500).optional(),
  }),
});
```

---

## Error Handling in Services

```typescript
// src/services/inventory.service.ts

import { Errors } from '../utils/errors';

export class InventoryService {
  async decreaseStock(productId: number, quantity: number, reason?: string) {
    // Get current product
    const product = await this.productRepository.findById(productId);
    
    if (!product) {
      throw Errors.productNotFound(productId);
    }

    // Validate stock availability
    if (product.quantity < quantity) {
      throw Errors.insufficientStock(quantity, product.quantity);
    }

    // Perform decrease
    const newQuantity = product.quantity - quantity;
    
    // Update and log
    await this.productRepository.updateQuantity(productId, newQuantity);
    await this.auditRepository.logChange({
      productId,
      changeType: 'STOCK_OUT',
      quantityBefore: product.quantity,
      quantityAfter: newQuantity,
      quantityChange: -quantity,
      reason,
    });

    return {
      product: { ...product, quantity: newQuantity },
      change: {
        type: 'STOCK_OUT',
        quantityBefore: product.quantity,
        quantityAfter: newQuantity,
        quantityChange: -quantity,
        reason,
      },
    };
  }
}
```

---

## Error Handling in Controllers

```typescript
// src/controllers/inventory.controller.ts

import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventory.service';

export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  decreaseStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = parseInt(req.params.productId, 10);
      const { quantity, reason } = req.body;

      const result = await this.inventoryService.decreaseStock(
        productId,
        quantity,
        reason
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
```

---

## Async Error Wrapper

```typescript
// src/utils/async-handler.ts

import { Request, Response, NextFunction } from 'express';

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const asyncHandler = (fn: AsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage in routes
router.post(
  '/:productId/decrease',
  validate(stockChangeSchema),
  asyncHandler(controller.decreaseStock)
);
```

---

## Database Error Handling

```typescript
// src/repositories/base.repository.ts

import { DatabaseError } from '../utils/errors';
import { logger } from '../utils/logger';

export abstract class BaseRepository {
  protected handleDatabaseError(error: unknown, operation: string): never {
    logger.error('Database error', {
      operation,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    // SQLite specific error handling
    if (error instanceof Error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        // Re-throw as conflict error - handled by service layer
        throw error;
      }
      if (error.message.includes('FOREIGN KEY constraint failed')) {
        throw error;
      }
    }

    throw new DatabaseError(`Failed to ${operation}`);
  }
}
```

---

## Unhandled Rejection & Exception Handling

```typescript
// src/app.ts

import { logger } from './utils/logger';

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown) => {
  logger.error('Unhandled Rejection', { reason });
  // Graceful shutdown
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception', { 
    error: error.message, 
    stack: error.stack 
  });
  // Graceful shutdown
  process.exit(1);
});
```

---

## Testing Error Handling

```typescript
// tests/unit/services/inventory.service.test.ts

describe('InventoryService', () => {
  describe('decreaseStock', () => {
    it('should throw InsufficientStockError when quantity exceeds available', async () => {
      // Arrange
      const product = { id: 1, quantity: 10 };
      mockProductRepo.findById.mockResolvedValue(product);

      // Act & Assert
      await expect(
        inventoryService.decreaseStock(1, 20)
      ).rejects.toMatchObject({
        code: 'INSUFFICIENT_STOCK',
        statusCode: 400,
      });
    });

    it('should throw ProductNotFoundError when product does not exist', async () => {
      // Arrange
      mockProductRepo.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        inventoryService.decreaseStock(999, 5)
      ).rejects.toMatchObject({
        code: 'PRODUCT_NOT_FOUND',
        statusCode: 404,
      });
    });
  });
});
```

---

## Error Handling Checklist

| Layer       | Responsibility                                       |
| ----------- | ---------------------------------------------------- |
| Middleware  | Validate input, catch validation errors              |
| Controller  | Try/catch, pass errors to next()                     |
| Service     | Business validation, throw specific errors           |
| Repository  | Database errors, constraint violations               |
| Global Handler | Format response, log errors, hide internal details |

---

## Best Practices

1. **Always use custom error classes** - Never throw generic `Error`
2. **Include error codes** - Enable programmatic error handling
3. **Provide helpful messages** - Users should understand what went wrong
4. **Log all errors** - With context (request ID, user, path)
5. **Hide internal errors in production** - Security concern
6. **Use async error wrapper** - Prevent unhandled promise rejections
7. **Validate early** - Fail fast with middleware validation
8. **Test error scenarios** - Ensure proper error handling

