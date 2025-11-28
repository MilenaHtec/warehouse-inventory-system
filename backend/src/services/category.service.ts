import { categoryRepository } from '../repositories/category.repository.js';
import { Errors } from '../utils/errors.js';
import type { Category, CategoryWithProductCount } from '@shared/types/index.js';
import type { CreateCategoryInput, UpdateCategoryInput } from '../validators/category.js';

// ============================================
// Category Service
// ============================================

export class CategoryService {
  getAll(): CategoryWithProductCount[] {
    return categoryRepository.findAll();
  }

  getById(id: number): Category {
    const category = categoryRepository.findById(id);
    if (!category) {
      throw Errors.categoryNotFound(id);
    }
    return category;
  }

  create(data: CreateCategoryInput): Category {
    // Check for unique name
    const existing = categoryRepository.findByName(data.name);
    if (existing) {
      throw Errors.categoryNameExists(data.name);
    }

    return categoryRepository.create({
      name: data.name,
      description: data.description,
    });
  }

  update(id: number, data: UpdateCategoryInput): Category {
    // Check if category exists
    const existing = categoryRepository.findById(id);
    if (!existing) {
      throw Errors.categoryNotFound(id);
    }

    // Check for unique name if name is being updated
    if (data.name && data.name !== existing.name) {
      const nameExists = categoryRepository.findByName(data.name);
      if (nameExists) {
        throw Errors.categoryNameExists(data.name);
      }
    }

    const updated = categoryRepository.update(id, data);
    if (!updated) {
      throw Errors.categoryNotFound(id);
    }

    return updated;
  }

  delete(id: number): void {
    // Check if category exists
    const existing = categoryRepository.findById(id);
    if (!existing) {
      throw Errors.categoryNotFound(id);
    }

    // Check if category has products
    const productCount = categoryRepository.getProductCount(id);
    if (productCount > 0) {
      throw Errors.categoryHasProducts();
    }

    categoryRepository.delete(id);
  }
}

// Export singleton instance
export const categoryService = new CategoryService();

