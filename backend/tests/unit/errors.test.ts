import { describe, it, expect } from '@jest/globals';
import {
  AppError,
  ValidationError,
  NotFoundError,
  ConflictError,
  BusinessError,
  DatabaseError,
  Errors,
} from '../../src/utils/errors';

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create error with default values', () => {
      const error = new AppError('Test error');
      
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('INTERNAL_ERROR');
      expect(error.isOperational).toBe(true);
    });

    it('should create error with custom values', () => {
      const error = new AppError('Custom error', 400, 'CUSTOM_CODE');
      
      expect(error.message).toBe('Custom error');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('CUSTOM_CODE');
    });
  });

  describe('ValidationError', () => {
    it('should create with default empty details', () => {
      const error = new ValidationError('Validation failed');
      
      expect(error.message).toBe('Validation failed');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.details).toEqual({});
    });

    it('should create with custom details', () => {
      const details = { field: ['Error 1', 'Error 2'] };
      const error = new ValidationError('Validation failed', details);
      
      expect(error.details).toEqual(details);
    });
  });

  describe('NotFoundError', () => {
    it('should create with resource and identifier', () => {
      const error = new NotFoundError('Product', 123);
      
      expect(error.message).toBe("Product with identifier '123' not found");
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe('NOT_FOUND');
    });

    it('should create with resource only (no identifier)', () => {
      const error = new NotFoundError('Product');
      
      expect(error.message).toBe('Product not found');
      expect(error.statusCode).toBe(404);
    });

    it('should handle string identifier', () => {
      const error = new NotFoundError('User', 'john@example.com');
      
      expect(error.message).toBe("User with identifier 'john@example.com' not found");
    });
  });

  describe('ConflictError', () => {
    it('should create conflict error', () => {
      const error = new ConflictError('Resource already exists');
      
      expect(error.message).toBe('Resource already exists');
      expect(error.statusCode).toBe(409);
      expect(error.code).toBe('CONFLICT');
    });
  });

  describe('BusinessError', () => {
    it('should create business error with custom code', () => {
      const error = new BusinessError('Business rule violated', 'RULE_VIOLATION');
      
      expect(error.message).toBe('Business rule violated');
      expect(error.statusCode).toBe(422);
      expect(error.code).toBe('RULE_VIOLATION');
    });
  });

  describe('DatabaseError', () => {
    it('should create with default message', () => {
      const error = new DatabaseError();
      
      expect(error.message).toBe('Database operation failed');
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('DATABASE_ERROR');
    });

    it('should create with custom message', () => {
      const error = new DatabaseError('Connection lost');
      
      expect(error.message).toBe('Connection lost');
    });
  });
});

describe('Errors Factory', () => {
  describe('Category Errors', () => {
    it('should create categoryNotFound error', () => {
      const error = Errors.categoryNotFound(1);
      
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toContain('Category');
      expect(error.message).toContain('1');
    });

    it('should create categoryNameExists error', () => {
      const error = Errors.categoryNameExists('Electronics');
      
      expect(error).toBeInstanceOf(ConflictError);
      expect(error.message).toContain('Electronics');
    });

    it('should create categoryHasProducts error', () => {
      const error = Errors.categoryHasProducts();
      
      expect(error).toBeInstanceOf(BusinessError);
      expect(error.code).toBe('CATEGORY_HAS_PRODUCTS');
    });
  });

  describe('Product Errors', () => {
    it('should create productNotFound error', () => {
      const error = Errors.productNotFound(42);
      
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toContain('Product');
      expect(error.message).toContain('42');
    });

    it('should create productCodeExists error', () => {
      const error = Errors.productCodeExists('SKU123');
      
      expect(error).toBeInstanceOf(ConflictError);
      expect(error.message).toContain('SKU123');
    });
  });

  describe('Inventory Errors', () => {
    it('should create insufficientStock error', () => {
      const error = Errors.insufficientStock(5, 10);
      
      expect(error).toBeInstanceOf(BusinessError);
      expect(error.code).toBe('INSUFFICIENT_STOCK');
      expect(error.message).toContain('5');
      expect(error.message).toContain('10');
    });

    it('should create invalidQuantity error', () => {
      const error = Errors.invalidQuantity();
      
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.details.quantity).toBeDefined();
    });

    it('should create negativeStockNotAllowed error', () => {
      const error = Errors.negativeStockNotAllowed();
      
      expect(error).toBeInstanceOf(BusinessError);
      expect(error.code).toBe('NEGATIVE_STOCK');
    });
  });

  describe('General Errors', () => {
    it('should create invalidId error', () => {
      const error = Errors.invalidId();
      
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.details.id).toBeDefined();
    });

    it('should create internal error with default message', () => {
      const error = Errors.internal();
      
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Internal server error');
      expect(error.statusCode).toBe(500);
    });

    it('should create internal error with custom message', () => {
      const error = Errors.internal('Something went wrong');
      
      expect(error.message).toBe('Something went wrong');
    });
  });
});

