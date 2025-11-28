import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock the repository
const mockCategoryRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByName: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getProductCount: jest.fn(),
};

// Mock modules before importing the service
jest.mock('../../src/repositories/category.repository', () => ({
  categoryRepository: mockCategoryRepository,
}));

// Import after mocking
import { CategoryService } from '../../src/services/category.service';
import { NotFoundError, ConflictError, BusinessError } from '../../src/utils/errors';

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CategoryService();
  });

  describe('getAll', () => {
    it('should return all categories with product counts', () => {
      // Arrange
      const categories = [
        { id: 1, name: 'Electronics', description: 'Electronic devices', product_count: 10 },
        { id: 2, name: 'Clothing', description: 'Apparel and accessories', product_count: 5 },
      ];
      mockCategoryRepository.findAll.mockReturnValue(categories);

      // Act
      const result = service.getAll();

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].product_count).toBe(10);
      expect(mockCategoryRepository.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no categories exist', () => {
      // Arrange
      mockCategoryRepository.findAll.mockReturnValue([]);

      // Act
      const result = service.getAll();

      // Assert
      expect(result).toHaveLength(0);
    });
  });

  describe('getById', () => {
    it('should return category when exists', () => {
      // Arrange
      const category = { id: 1, name: 'Electronics', description: 'Electronic devices' };
      mockCategoryRepository.findById.mockReturnValue(category);

      // Act
      const result = service.getById(1);

      // Assert
      expect(result).toEqual(category);
      expect(mockCategoryRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundError when category does not exist', () => {
      // Arrange
      mockCategoryRepository.findById.mockReturnValue(undefined);

      // Act & Assert
      expect(() => service.getById(999)).toThrow(NotFoundError);
    });
  });

  describe('create', () => {
    it('should create category successfully', () => {
      // Arrange
      const createData = { name: 'New Category', description: 'A new category' };
      const created = { id: 1, ...createData };

      mockCategoryRepository.findByName.mockReturnValue(undefined);
      mockCategoryRepository.create.mockReturnValue(created);

      // Act
      const result = service.create(createData);

      // Assert
      expect(result.id).toBe(1);
      expect(result.name).toBe('New Category');
      expect(mockCategoryRepository.findByName).toHaveBeenCalledWith('New Category');
    });

    it('should create category without description', () => {
      // Arrange
      const createData = { name: 'Simple Category' };
      const created = { id: 1, name: 'Simple Category', description: null };

      mockCategoryRepository.findByName.mockReturnValue(undefined);
      mockCategoryRepository.create.mockReturnValue(created);

      // Act
      const result = service.create(createData);

      // Assert
      expect(result.id).toBe(1);
      expect(result.description).toBeNull();
    });

    it('should throw ConflictError when category name already exists', () => {
      // Arrange
      const existingCategory = { id: 1, name: 'Existing' };
      mockCategoryRepository.findByName.mockReturnValue(existingCategory);

      // Act & Assert
      expect(() => service.create({ name: 'Existing' })).toThrow(ConflictError);
    });
  });

  describe('update', () => {
    it('should update category successfully', () => {
      // Arrange
      const existing = { id: 1, name: 'Old Name', description: 'Old description' };
      const updateData = { name: 'New Name', description: 'New description' };
      const updated = { id: 1, ...updateData };

      mockCategoryRepository.findById.mockReturnValue(existing);
      mockCategoryRepository.findByName.mockReturnValue(undefined);
      mockCategoryRepository.update.mockReturnValue(updated);

      // Act
      const result = service.update(1, updateData);

      // Assert
      expect(result.name).toBe('New Name');
      expect(result.description).toBe('New description');
    });

    it('should update only description', () => {
      // Arrange
      const existing = { id: 1, name: 'Category', description: 'Old description' };
      const updateData = { description: 'Updated description' };
      const updated = { ...existing, ...updateData };

      mockCategoryRepository.findById.mockReturnValue(existing);
      mockCategoryRepository.update.mockReturnValue(updated);

      // Act
      const result = service.update(1, updateData);

      // Assert
      expect(result.description).toBe('Updated description');
      expect(mockCategoryRepository.findByName).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError when category does not exist', () => {
      // Arrange
      mockCategoryRepository.findById.mockReturnValue(undefined);

      // Act & Assert
      expect(() => service.update(999, { name: 'New Name' })).toThrow(NotFoundError);
    });

    it('should throw ConflictError when new name already exists', () => {
      // Arrange
      const existing = { id: 1, name: 'Category A' };
      const otherCategory = { id: 2, name: 'Category B' };

      mockCategoryRepository.findById.mockReturnValue(existing);
      mockCategoryRepository.findByName.mockReturnValue(otherCategory);

      // Act & Assert
      expect(() => service.update(1, { name: 'Category B' })).toThrow(ConflictError);
    });

    it('should allow keeping same category name', () => {
      // Arrange
      const existing = { id: 1, name: 'Category', description: 'Old' };
      const updated = { ...existing, description: 'New' };

      mockCategoryRepository.findById.mockReturnValue(existing);
      mockCategoryRepository.update.mockReturnValue(updated);

      // Act - update with same name
      const result = service.update(1, { name: 'Category', description: 'New' });

      // Assert
      expect(result.description).toBe('New');
      expect(mockCategoryRepository.findByName).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete category successfully when no products', () => {
      // Arrange
      const existing = { id: 1, name: 'Empty Category' };
      mockCategoryRepository.findById.mockReturnValue(existing);
      mockCategoryRepository.getProductCount.mockReturnValue(0);
      mockCategoryRepository.delete.mockReturnValue(undefined);

      // Act
      service.delete(1);

      // Assert
      expect(mockCategoryRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundError when category does not exist', () => {
      // Arrange
      mockCategoryRepository.findById.mockReturnValue(undefined);

      // Act & Assert
      expect(() => service.delete(999)).toThrow(NotFoundError);
    });

    it('should throw BusinessError when category has products', () => {
      // Arrange
      const existing = { id: 1, name: 'Category with Products' };
      mockCategoryRepository.findById.mockReturnValue(existing);
      mockCategoryRepository.getProductCount.mockReturnValue(5);

      // Act & Assert
      expect(() => service.delete(1)).toThrow(BusinessError);
    });

    it('should throw BusinessError with correct message when category has products', () => {
      // Arrange
      const existing = { id: 1, name: 'Category with Products' };
      mockCategoryRepository.findById.mockReturnValue(existing);
      mockCategoryRepository.getProductCount.mockReturnValue(10);

      // Act & Assert
      try {
        service.delete(1);
        fail('Expected BusinessError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessError);
        expect((error as BusinessError).message).toContain('products');
      }
    });
  });
});

