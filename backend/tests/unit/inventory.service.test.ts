import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock the repositories
const mockProductRepository = {
  findById: jest.fn(),
  updateQuantity: jest.fn(),
};

const mockInventoryRepository = {
  logChange: jest.fn(),
  findByProductId: jest.fn(),
  findAll: jest.fn(),
};

const mockTransaction = jest.fn((fn: () => unknown) => fn());

// Mock modules before importing the service
jest.mock('../../src/repositories/product.repository.js', () => ({
  productRepository: mockProductRepository,
}));

jest.mock('../../src/repositories/inventory.repository.js', () => ({
  inventoryRepository: mockInventoryRepository,
}));

jest.mock('../../src/config/database.js', () => ({
  transaction: mockTransaction,
}));

// Import after mocking
import { InventoryService } from '../../src/services/inventory.service.js';
import { BusinessError, NotFoundError } from '../../src/utils/errors.js';

describe('InventoryService', () => {
  let service: InventoryService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new InventoryService();
  });

  describe('increaseStock', () => {
    it('should increase stock successfully', () => {
      // Arrange
      const product = { id: 1, name: 'Test Product', quantity: 10 };
      const changeData = { quantity: 5, reason: 'Restocking' };
      
      mockProductRepository.findById.mockReturnValue(product);
      mockProductRepository.updateQuantity.mockReturnValue(true);
      mockInventoryRepository.logChange.mockReturnValue({
        id: 1,
        product_id: 1,
        change_type: 'increase',
        quantity_change: 5,
        quantity_before: 10,
        quantity_after: 15,
        reason: 'Restocking',
      });

      // Act
      const result = service.increaseStock(1, changeData);

      // Assert
      expect(mockProductRepository.findById).toHaveBeenCalledWith(1);
      expect(mockProductRepository.updateQuantity).toHaveBeenCalledWith(1, 15);
      expect(mockInventoryRepository.logChange).toHaveBeenCalledWith({
        product_id: 1,
        change_type: 'increase',
        quantity_change: 5,
        quantity_before: 10,
        quantity_after: 15,
        reason: 'Restocking',
      });
      expect(result.quantity_after).toBe(15);
    });

    it('should throw NotFoundError if product does not exist', () => {
      // Arrange
      mockProductRepository.findById.mockReturnValue(undefined);

      // Act & Assert
      expect(() => service.increaseStock(999, { quantity: 5 }))
        .toThrow(NotFoundError);
    });
  });

  describe('decreaseStock', () => {
    it('should decrease stock successfully when sufficient stock', () => {
      // Arrange
      const product = { id: 1, name: 'Test Product', quantity: 10 };
      const changeData = { quantity: 5, reason: 'Sale' };
      
      mockProductRepository.findById.mockReturnValue(product);
      mockProductRepository.updateQuantity.mockReturnValue(true);
      mockInventoryRepository.logChange.mockReturnValue({
        id: 1,
        product_id: 1,
        change_type: 'decrease',
        quantity_change: -5,
        quantity_before: 10,
        quantity_after: 5,
        reason: 'Sale',
      });

      // Act
      const result = service.decreaseStock(1, changeData);

      // Assert
      expect(mockProductRepository.updateQuantity).toHaveBeenCalledWith(1, 5);
      expect(result.quantity_after).toBe(5);
    });

    it('should throw BusinessError when insufficient stock', () => {
      // Arrange
      const product = { id: 1, name: 'Test Product', quantity: 3 };
      mockProductRepository.findById.mockReturnValue(product);

      // Act & Assert
      expect(() => service.decreaseStock(1, { quantity: 5 }))
        .toThrow(BusinessError);
    });

    it('should allow decreasing to exactly zero', () => {
      // Arrange
      const product = { id: 1, name: 'Test Product', quantity: 5 };
      mockProductRepository.findById.mockReturnValue(product);
      mockProductRepository.updateQuantity.mockReturnValue(true);
      mockInventoryRepository.logChange.mockReturnValue({
        id: 1,
        product_id: 1,
        change_type: 'decrease',
        quantity_change: -5,
        quantity_before: 5,
        quantity_after: 0,
        reason: null,
      });

      // Act
      const result = service.decreaseStock(1, { quantity: 5 });

      // Assert
      expect(mockProductRepository.updateQuantity).toHaveBeenCalledWith(1, 0);
      expect(result.quantity_after).toBe(0);
    });

    it('should throw NotFoundError if product does not exist', () => {
      // Arrange
      mockProductRepository.findById.mockReturnValue(undefined);

      // Act & Assert
      expect(() => service.decreaseStock(999, { quantity: 5 }))
        .toThrow(NotFoundError);
    });
  });

  describe('adjustStock', () => {
    it('should adjust stock to new quantity', () => {
      // Arrange
      const product = { id: 1, name: 'Test Product', quantity: 10 };
      const adjustData = { new_quantity: 25, reason: 'Inventory count' };
      
      mockProductRepository.findById.mockReturnValue(product);
      mockProductRepository.updateQuantity.mockReturnValue(true);
      mockInventoryRepository.logChange.mockReturnValue({
        id: 1,
        product_id: 1,
        change_type: 'adjustment',
        quantity_change: 15,
        quantity_before: 10,
        quantity_after: 25,
        reason: 'Inventory count',
      });

      // Act
      const result = service.adjustStock(1, adjustData);

      // Assert
      expect(mockProductRepository.updateQuantity).toHaveBeenCalledWith(1, 25);
      expect(result.quantity_change).toBe(15);
    });

    it('should handle negative adjustment', () => {
      // Arrange
      const product = { id: 1, name: 'Test Product', quantity: 20 };
      const adjustData = { new_quantity: 5, reason: 'Damaged goods' };
      
      mockProductRepository.findById.mockReturnValue(product);
      mockProductRepository.updateQuantity.mockReturnValue(true);
      mockInventoryRepository.logChange.mockReturnValue({
        id: 1,
        product_id: 1,
        change_type: 'adjustment',
        quantity_change: -15,
        quantity_before: 20,
        quantity_after: 5,
        reason: 'Damaged goods',
      });

      // Act
      const result = service.adjustStock(1, adjustData);

      // Assert
      expect(result.quantity_change).toBe(-15);
    });
  });

  describe('getHistory', () => {
    it('should return paginated history for existing product', () => {
      // Arrange
      const product = { id: 1, name: 'Test Product', quantity: 10 };
      const historyData = {
        history: [
          { id: 1, product_id: 1, change_type: 'increase', quantity_change: 5 },
          { id: 2, product_id: 1, change_type: 'decrease', quantity_change: -2 },
        ],
        total: 2,
      };
      
      mockProductRepository.findById.mockReturnValue(product);
      mockInventoryRepository.findByProductId.mockReturnValue(historyData);

      // Act
      const result = service.getHistory(1, { page: 1, limit: 10 });

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
    });

    it('should throw NotFoundError if product does not exist', () => {
      // Arrange
      mockProductRepository.findById.mockReturnValue(undefined);

      // Act & Assert
      expect(() => service.getHistory(999, {}))
        .toThrow(NotFoundError);
    });
  });
});

