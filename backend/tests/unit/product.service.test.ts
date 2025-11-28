import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock the repositories
const mockProductRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByCode: jest.fn(),
  search: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockCategoryRepository = {
  findById: jest.fn(),
};

// Mock modules before importing the service
jest.mock('../../src/repositories/product.repository', () => ({
  productRepository: mockProductRepository,
}));

jest.mock('../../src/repositories/category.repository', () => ({
  categoryRepository: mockCategoryRepository,
}));

// Import after mocking
import { ProductService } from '../../src/services/product.service';
import { NotFoundError, ConflictError } from '../../src/utils/errors';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProductService();
  });

  describe('getAll', () => {
    it('should return paginated products', () => {
      // Arrange
      const products = [
        { id: 1, name: 'Product 1', product_code: 'P001', price: 10.00, quantity: 5, category_id: 1, category_name: 'Category 1' },
        { id: 2, name: 'Product 2', product_code: 'P002', price: 20.00, quantity: 10, category_id: 1, category_name: 'Category 1' },
      ];
      mockProductRepository.findAll.mockReturnValue({ products, total: 2 });

      // Act
      const result = service.getAll({ page: 1, limit: 20 });

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.total_pages).toBe(1);
    });

    it('should calculate correct total pages', () => {
      // Arrange
      const products = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Product ${i + 1}`,
        product_code: `P00${i + 1}`,
        price: 10.00,
        quantity: 5,
        category_id: 1,
        category_name: 'Category 1',
      }));
      mockProductRepository.findAll.mockReturnValue({ products, total: 25 });

      // Act
      const result = service.getAll({ page: 1, limit: 10 });

      // Assert
      expect(result.pagination.total_pages).toBe(3);
    });

    it('should use default pagination values', () => {
      // Arrange
      mockProductRepository.findAll.mockReturnValue({ products: [], total: 0 });

      // Act
      const result = service.getAll({});

      // Assert
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(20);
    });
  });

  describe('getById', () => {
    it('should return product when exists', () => {
      // Arrange
      const product = { id: 1, name: 'Test Product', product_code: 'P001', price: 10.00, quantity: 5, category_id: 1, category_name: 'Category 1' };
      mockProductRepository.findById.mockReturnValue(product);

      // Act
      const result = service.getById(1);

      // Assert
      expect(result).toEqual(product);
      expect(mockProductRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundError when product does not exist', () => {
      // Arrange
      mockProductRepository.findById.mockReturnValue(undefined);

      // Act & Assert
      expect(() => service.getById(999)).toThrow(NotFoundError);
    });
  });

  describe('search', () => {
    it('should return matching products', () => {
      // Arrange
      const products = [
        { id: 1, name: 'Apple iPhone', product_code: 'IPHONE', price: 999.00, quantity: 10, category_id: 1, category_name: 'Electronics' },
      ];
      mockProductRepository.search.mockReturnValue(products);

      // Act
      const result = service.search('iPhone');

      // Assert
      expect(result).toHaveLength(1);
      expect(mockProductRepository.search).toHaveBeenCalledWith('iPhone');
    });

    it('should return empty array when no matches', () => {
      // Arrange
      mockProductRepository.search.mockReturnValue([]);

      // Act
      const result = service.search('nonexistent');

      // Assert
      expect(result).toHaveLength(0);
    });
  });

  describe('create', () => {
    it('should create product successfully', () => {
      // Arrange
      const createData = {
        name: 'New Product',
        product_code: 'NP001',
        price: 29.99,
        quantity: 10,
        category_id: 1,
      };
      const category = { id: 1, name: 'Category 1' };
      const createdProduct = { id: 1, ...createData };

      mockCategoryRepository.findById.mockReturnValue(category);
      mockProductRepository.findByCode.mockReturnValue(undefined);
      mockProductRepository.create.mockReturnValue(createdProduct);

      // Act
      const result = service.create(createData);

      // Assert
      expect(result.id).toBe(1);
      expect(result.name).toBe('New Product');
      expect(mockCategoryRepository.findById).toHaveBeenCalledWith(1);
      expect(mockProductRepository.findByCode).toHaveBeenCalledWith('NP001');
    });

    it('should throw NotFoundError when category does not exist', () => {
      // Arrange
      mockCategoryRepository.findById.mockReturnValue(undefined);

      // Act & Assert
      expect(() => service.create({
        name: 'New Product',
        product_code: 'NP001',
        price: 29.99,
        quantity: 0,
        category_id: 999,
      })).toThrow(NotFoundError);
    });

    it('should throw ConflictError when product code already exists', () => {
      // Arrange
      const category = { id: 1, name: 'Category 1' };
      const existingProduct = { id: 1, product_code: 'EXISTING' };

      mockCategoryRepository.findById.mockReturnValue(category);
      mockProductRepository.findByCode.mockReturnValue(existingProduct);

      // Act & Assert
      expect(() => service.create({
        name: 'New Product',
        product_code: 'EXISTING',
        price: 29.99,
        quantity: 0,
        category_id: 1,
      })).toThrow(ConflictError);
    });

    it('should use provided quantity or default to 0', () => {
      // Arrange
      const createData = {
        name: 'New Product',
        product_code: 'NP001',
        price: 29.99,
        quantity: 5,
        category_id: 1,
      };
      const category = { id: 1, name: 'Category 1' };

      mockCategoryRepository.findById.mockReturnValue(category);
      mockProductRepository.findByCode.mockReturnValue(undefined);
      mockProductRepository.create.mockReturnValue({ id: 1, ...createData });

      // Act
      service.create(createData);

      // Assert
      expect(mockProductRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        quantity: 5,
      }));
    });
  });

  describe('update', () => {
    it('should update product successfully', () => {
      // Arrange
      const existing = { id: 1, name: 'Old Name', product_code: 'P001', price: 10.00, quantity: 5, category_id: 1 };
      const updateData = { name: 'New Name', price: 15.00 };
      const updated = { ...existing, ...updateData };

      mockProductRepository.findById.mockReturnValue(existing);
      mockProductRepository.update.mockReturnValue(updated);

      // Act
      const result = service.update(1, updateData);

      // Assert
      expect(result.name).toBe('New Name');
      expect(result.price).toBe(15.00);
    });

    it('should throw NotFoundError when product does not exist', () => {
      // Arrange
      mockProductRepository.findById.mockReturnValue(undefined);

      // Act & Assert
      expect(() => service.update(999, { name: 'New Name' })).toThrow(NotFoundError);
    });

    it('should throw NotFoundError when new category does not exist', () => {
      // Arrange
      const existing = { id: 1, name: 'Product', product_code: 'P001', price: 10.00, quantity: 5, category_id: 1 };
      mockProductRepository.findById.mockReturnValue(existing);
      mockCategoryRepository.findById.mockReturnValue(undefined);

      // Act & Assert
      expect(() => service.update(1, { category_id: 999 })).toThrow(NotFoundError);
    });

    it('should throw ConflictError when new product code already exists', () => {
      // Arrange
      const existing = { id: 1, name: 'Product', product_code: 'P001', price: 10.00, quantity: 5, category_id: 1 };
      const otherProduct = { id: 2, product_code: 'P002' };

      mockProductRepository.findById.mockReturnValue(existing);
      mockProductRepository.findByCode.mockReturnValue(otherProduct);

      // Act & Assert
      expect(() => service.update(1, { product_code: 'P002' })).toThrow(ConflictError);
    });

    it('should allow keeping same product code', () => {
      // Arrange
      const existing = { id: 1, name: 'Product', product_code: 'P001', price: 10.00, quantity: 5, category_id: 1 };
      const updated = { ...existing, name: 'Updated Name' };

      mockProductRepository.findById.mockReturnValue(existing);
      mockProductRepository.update.mockReturnValue(updated);

      // Act - update with same product code
      const result = service.update(1, { product_code: 'P001', name: 'Updated Name' });

      // Assert
      expect(result.name).toBe('Updated Name');
      expect(mockProductRepository.findByCode).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete product successfully', () => {
      // Arrange
      const existing = { id: 1, name: 'Product', product_code: 'P001' };
      mockProductRepository.findById.mockReturnValue(existing);
      mockProductRepository.delete.mockReturnValue(undefined);

      // Act
      service.delete(1);

      // Assert
      expect(mockProductRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundError when product does not exist', () => {
      // Arrange
      mockProductRepository.findById.mockReturnValue(undefined);

      // Act & Assert
      expect(() => service.delete(999)).toThrow(NotFoundError);
    });
  });
});

