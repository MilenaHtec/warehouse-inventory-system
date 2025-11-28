import { productRepository } from '../repositories/product.repository.js';
import { inventoryRepository } from '../repositories/inventory.repository.js';
import { transaction } from '../config/database.js';
import { Errors } from '../utils/errors.js';
import type { 
  InventoryHistory, 
  InventoryHistoryWithProduct,
  InventoryHistoryFilters,
  PaginatedResponse 
} from '@shared/types/index.js';
import type { StockChangeInput, StockAdjustInput } from '../validators/inventory.js';

// ============================================
// Inventory Service
// ============================================

export class InventoryService {
  increaseStock(productId: number, data: StockChangeInput): InventoryHistory {
    return transaction(() => {
      // Get current product
      const product = productRepository.findById(productId);
      if (!product) {
        throw Errors.productNotFound(productId);
      }

      const quantityBefore = product.quantity;
      const quantityAfter = quantityBefore + data.quantity;

      // Update product quantity
      productRepository.updateQuantity(productId, quantityAfter);

      // Log the change
      return inventoryRepository.logChange({
        product_id: productId,
        change_type: 'increase',
        quantity_change: data.quantity,
        quantity_before: quantityBefore,
        quantity_after: quantityAfter,
        reason: data.reason,
      });
    });
  }

  decreaseStock(productId: number, data: StockChangeInput): InventoryHistory {
    return transaction(() => {
      // Get current product
      const product = productRepository.findById(productId);
      if (!product) {
        throw Errors.productNotFound(productId);
      }

      const quantityBefore = product.quantity;
      const quantityAfter = quantityBefore - data.quantity;

      // Check if we have enough stock
      if (quantityAfter < 0) {
        throw Errors.insufficientStock(quantityBefore, data.quantity);
      }

      // Update product quantity
      productRepository.updateQuantity(productId, quantityAfter);

      // Log the change
      return inventoryRepository.logChange({
        product_id: productId,
        change_type: 'decrease',
        quantity_change: -data.quantity,
        quantity_before: quantityBefore,
        quantity_after: quantityAfter,
        reason: data.reason,
      });
    });
  }

  adjustStock(productId: number, data: StockAdjustInput): InventoryHistory {
    return transaction(() => {
      // Get current product
      const product = productRepository.findById(productId);
      if (!product) {
        throw Errors.productNotFound(productId);
      }

      const quantityBefore = product.quantity;
      const quantityAfter = data.new_quantity;
      const quantityChange = quantityAfter - quantityBefore;

      // Update product quantity
      productRepository.updateQuantity(productId, quantityAfter);

      // Log the change
      return inventoryRepository.logChange({
        product_id: productId,
        change_type: 'adjustment',
        quantity_change: quantityChange,
        quantity_before: quantityBefore,
        quantity_after: quantityAfter,
        reason: data.reason,
      });
    });
  }

  getHistory(
    productId: number,
    filters: InventoryHistoryFilters
  ): PaginatedResponse<InventoryHistoryWithProduct> {
    // Verify product exists
    const product = productRepository.findById(productId);
    if (!product) {
      throw Errors.productNotFound(productId);
    }

    const { history, total } = inventoryRepository.findByProductId(productId, filters);
    const page = filters.page || 1;
    const limit = filters.limit || 20;

    return {
      success: true,
      data: history,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  getAllHistory(filters: InventoryHistoryFilters): PaginatedResponse<InventoryHistoryWithProduct> {
    const { history, total } = inventoryRepository.findAll(filters);
    const page = filters.page || 1;
    const limit = filters.limit || 20;

    return {
      success: true,
      data: history,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }
}

// Export singleton instance
export const inventoryService = new InventoryService();

