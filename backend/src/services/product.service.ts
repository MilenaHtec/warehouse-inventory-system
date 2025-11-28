import { productRepository } from '../repositories/product.repository.js';
import { categoryRepository } from '../repositories/category.repository.js';
import { Errors } from '../utils/errors.js';
import type { Product, ProductWithCategory, ProductFilters, PaginatedResponse } from '@shared/types/index.js';
import type { CreateProductInput, UpdateProductInput } from '../validators/product.js';

// ============================================
// Product Service
// ============================================

export class ProductService {
  getAll(filters: ProductFilters): PaginatedResponse<ProductWithCategory> {
    const { products, total } = productRepository.findAll(filters);
    const page = filters.page || 1;
    const limit = filters.limit || 20;

    return {
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  getById(id: number): ProductWithCategory {
    const product = productRepository.findById(id);
    if (!product) {
      throw Errors.productNotFound(id);
    }
    return product;
  }

  search(query: string): ProductWithCategory[] {
    return productRepository.search(query);
  }

  create(data: CreateProductInput): Product {
    // Check if category exists
    const category = categoryRepository.findById(data.category_id);
    if (!category) {
      throw Errors.categoryNotFound(data.category_id);
    }

    // Check for unique product code
    const existing = productRepository.findByCode(data.product_code);
    if (existing) {
      throw Errors.productCodeExists(data.product_code);
    }

    return productRepository.create({
      name: data.name,
      product_code: data.product_code,
      price: data.price,
      quantity: data.quantity || 0,
      category_id: data.category_id,
    });
  }

  update(id: number, data: UpdateProductInput): Product {
    // Check if product exists
    const existing = productRepository.findById(id);
    if (!existing) {
      throw Errors.productNotFound(id);
    }

    // Check if category exists if being updated
    if (data.category_id) {
      const category = categoryRepository.findById(data.category_id);
      if (!category) {
        throw Errors.categoryNotFound(data.category_id);
      }
    }

    // Check for unique product code if being updated
    if (data.product_code && data.product_code !== existing.product_code) {
      const codeExists = productRepository.findByCode(data.product_code);
      if (codeExists) {
        throw Errors.productCodeExists(data.product_code);
      }
    }

    const updated = productRepository.update(id, data);
    if (!updated) {
      throw Errors.productNotFound(id);
    }

    return updated;
  }

  delete(id: number): void {
    const existing = productRepository.findById(id);
    if (!existing) {
      throw Errors.productNotFound(id);
    }

    productRepository.delete(id);
  }
}

// Export singleton instance
export const productService = new ProductService();

