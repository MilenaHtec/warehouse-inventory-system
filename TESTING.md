# Testing Specification

## Overview

This document defines the testing strategy, standards, and implementation guidelines for the Warehouse Inventory System. The goal is to achieve **minimum 70% code coverage** as specified in requirements.

---

## Testing Strategy

### Test Pyramid

```
                    ┌─────────────────┐
                   │      E2E        │     5%   - Critical user flows
                  │    (Cypress)     │
                 └─────────────────┘
              ┌─────────────────────────┐
             │      Integration        │    25%  - API endpoints, DB
            │     (Jest + Supertest)   │
           └─────────────────────────┘
        ┌─────────────────────────────────┐
       │           Unit Tests            │   70%  - Services, utils, components
      │      (Jest / Vitest + RTL)       │
     └─────────────────────────────────┘
```

### Coverage Targets

| Component    | Minimum Coverage | Priority |
| ------------ | ---------------- | -------- |
| Services     | 80%              | High     |
| Repositories | 70%              | High     |
| Controllers  | 70%              | Medium   |
| Middleware   | 75%              | Medium   |
| Utils        | 90%              | High     |
| Components   | 70%              | Medium   |
| Hooks        | 75%              | Medium   |

---

## Backend Testing

### Technology Stack

| Tool           | Purpose                              |
| -------------- | ------------------------------------ |
| Jest           | Test runner and assertion library    |
| ts-jest        | TypeScript support for Jest          |
| Supertest      | HTTP assertions for integration tests|
| better-sqlite3 | In-memory database for tests         |

### Directory Structure

```
backend/
├── src/
│   └── ...
├── tests/
│   ├── setup.ts                    # Global test setup
│   ├── helpers/
│   │   ├── database.helper.ts      # Test database utilities
│   │   ├── factory.helper.ts       # Test data factories
│   │   └── mock.helper.ts          # Mock utilities
│   ├── unit/
│   │   ├── services/
│   │   │   ├── product.service.test.ts
│   │   │   ├── category.service.test.ts
│   │   │   ├── inventory.service.test.ts
│   │   │   └── report.service.test.ts
│   │   ├── repositories/
│   │   │   ├── product.repository.test.ts
│   │   │   ├── category.repository.test.ts
│   │   │   └── inventory.repository.test.ts
│   │   ├── middleware/
│   │   │   ├── error-handler.test.ts
│   │   │   └── validation.test.ts
│   │   └── utils/
│   │       ├── errors.test.ts
│   │       └── validators.test.ts
│   └── integration/
│       ├── products.test.ts
│       ├── categories.test.ts
│       ├── inventory.test.ts
│       └── reports.test.ts
├── jest.config.js
└── package.json
```

---

### Jest Configuration

```javascript
// backend/jest.config.js

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  
  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/types/**',
    '!src/app.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],

  // Module paths
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Performance
  maxWorkers: '50%',
  
  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,
};
```

---

### Test Setup

```typescript
// backend/tests/setup.ts

import { Database } from 'better-sqlite3';
import { createTestDatabase, closeTestDatabase } from './helpers/database.helper';

let db: Database;

beforeAll(async () => {
  db = createTestDatabase();
});

afterAll(async () => {
  closeTestDatabase(db);
});

beforeEach(async () => {
  // Clear all tables before each test
  db.exec('DELETE FROM inventory_history');
  db.exec('DELETE FROM products');
  db.exec('DELETE FROM categories');
});
```

### Database Helper

```typescript
// backend/tests/helpers/database.helper.ts

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

export const createTestDatabase = (): Database => {
  // Create in-memory database
  const db = new Database(':memory:');
  
  // Enable foreign keys
  db.pragma('foreign_keys = ON');
  
  // Run migrations
  const migrationPath = path.join(__dirname, '../../database/migrations/001_initial.sql');
  const migration = fs.readFileSync(migrationPath, 'utf8');
  db.exec(migration);
  
  return db;
};

export const closeTestDatabase = (db: Database): void => {
  db.close();
};

export const seedTestData = (db: Database): void => {
  // Insert test categories
  db.exec(`
    INSERT INTO categories (id, name, description) VALUES
    (1, 'Beverages', 'Drinks'),
    (2, 'Snacks', 'Snack foods');
  `);
  
  // Insert test products
  db.exec(`
    INSERT INTO products (id, name, product_code, price, quantity, category_id) VALUES
    (1, 'Coca-Cola', 'BEV-001', 2.99, 100, 1),
    (2, 'Pepsi', 'BEV-002', 2.89, 80, 1),
    (3, 'Chips', 'SNK-001', 3.49, 50, 2);
  `);
};
```

---

### Factory Helper

```typescript
// backend/tests/helpers/factory.helper.ts

import { faker } from '@faker-js/faker';

export const ProductFactory = {
  build: (overrides = {}) => ({
    name: faker.commerce.productName(),
    productCode: `PRD-${faker.string.alphanumeric(5).toUpperCase()}`,
    price: parseFloat(faker.commerce.price({ min: 1, max: 100 })),
    quantity: faker.number.int({ min: 0, max: 500 }),
    categoryId: 1,
    ...overrides,
  }),
  
  buildMany: (count: number, overrides = {}) => 
    Array.from({ length: count }, () => ProductFactory.build(overrides)),
};

export const CategoryFactory = {
  build: (overrides = {}) => ({
    name: faker.commerce.department(),
    description: faker.commerce.productDescription(),
    ...overrides,
  }),
};

export const StockChangeFactory = {
  build: (overrides = {}) => ({
    quantity: faker.number.int({ min: 1, max: 50 }),
    reason: faker.lorem.sentence(),
    ...overrides,
  }),
};
```

---

### Unit Tests Examples

#### Service Tests

```typescript
// backend/tests/unit/services/inventory.service.test.ts

import { InventoryService } from '@/services/inventory.service';
import { ProductRepository } from '@/repositories/product.repository';
import { AuditRepository } from '@/repositories/audit.repository';
import { Errors } from '@/utils/errors';

describe('InventoryService', () => {
  let inventoryService: InventoryService;
  let mockProductRepo: jest.Mocked<ProductRepository>;
  let mockAuditRepo: jest.Mocked<AuditRepository>;

  beforeEach(() => {
    mockProductRepo = {
      findById: jest.fn(),
      updateQuantity: jest.fn(),
    } as any;
    
    mockAuditRepo = {
      logChange: jest.fn(),
    } as any;

    inventoryService = new InventoryService(mockProductRepo, mockAuditRepo);
  });

  describe('increaseStock', () => {
    it('should increase stock quantity successfully', async () => {
      // Arrange
      const product = { id: 1, name: 'Test', quantity: 100 };
      mockProductRepo.findById.mockResolvedValue(product);
      mockProductRepo.updateQuantity.mockResolvedValue(undefined);
      mockAuditRepo.logChange.mockResolvedValue(undefined);

      // Act
      const result = await inventoryService.increaseStock(1, 50, 'Shipment');

      // Assert
      expect(result.product.quantity).toBe(150);
      expect(result.change.type).toBe('STOCK_IN');
      expect(result.change.quantityChange).toBe(50);
      expect(mockProductRepo.updateQuantity).toHaveBeenCalledWith(1, 150);
      expect(mockAuditRepo.logChange).toHaveBeenCalledWith(
        expect.objectContaining({
          productId: 1,
          changeType: 'STOCK_IN',
          quantityBefore: 100,
          quantityAfter: 150,
        })
      );
    });

    it('should throw NotFoundError when product does not exist', async () => {
      // Arrange
      mockProductRepo.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(inventoryService.increaseStock(999, 50))
        .rejects
        .toMatchObject({
          code: 'PRODUCT_NOT_FOUND',
          statusCode: 404,
        });
    });
  });

  describe('decreaseStock', () => {
    it('should decrease stock quantity successfully', async () => {
      // Arrange
      const product = { id: 1, name: 'Test', quantity: 100 };
      mockProductRepo.findById.mockResolvedValue(product);

      // Act
      const result = await inventoryService.decreaseStock(1, 30, 'Sale');

      // Assert
      expect(result.product.quantity).toBe(70);
      expect(result.change.type).toBe('STOCK_OUT');
      expect(result.change.quantityChange).toBe(-30);
    });

    it('should throw InsufficientStockError when quantity exceeds available', async () => {
      // Arrange
      const product = { id: 1, name: 'Test', quantity: 20 };
      mockProductRepo.findById.mockResolvedValue(product);

      // Act & Assert
      await expect(inventoryService.decreaseStock(1, 50))
        .rejects
        .toMatchObject({
          code: 'INSUFFICIENT_STOCK',
          statusCode: 400,
        });
    });

    it('should allow decreasing to exactly zero', async () => {
      // Arrange
      const product = { id: 1, name: 'Test', quantity: 50 };
      mockProductRepo.findById.mockResolvedValue(product);

      // Act
      const result = await inventoryService.decreaseStock(1, 50);

      // Assert
      expect(result.product.quantity).toBe(0);
    });
  });

  describe('adjustStock', () => {
    it('should adjust stock to new quantity', async () => {
      // Arrange
      const product = { id: 1, name: 'Test', quantity: 100 };
      mockProductRepo.findById.mockResolvedValue(product);

      // Act
      const result = await inventoryService.adjustStock(1, 85, 'Inventory correction');

      // Assert
      expect(result.product.quantity).toBe(85);
      expect(result.change.type).toBe('ADJUSTMENT');
      expect(result.change.quantityChange).toBe(-15);
    });

    it('should throw error when reason is not provided', async () => {
      // Arrange
      const product = { id: 1, name: 'Test', quantity: 100 };
      mockProductRepo.findById.mockResolvedValue(product);

      // Act & Assert
      await expect(inventoryService.adjustStock(1, 85, ''))
        .rejects
        .toMatchObject({
          code: 'VALIDATION_ERROR',
        });
    });
  });
});
```

#### Repository Tests

```typescript
// backend/tests/unit/repositories/product.repository.test.ts

import { ProductRepository } from '@/repositories/product.repository';
import { createTestDatabase, seedTestData } from '../helpers/database.helper';
import { ProductFactory } from '../helpers/factory.helper';

describe('ProductRepository', () => {
  let db: Database;
  let repository: ProductRepository;

  beforeAll(() => {
    db = createTestDatabase();
    repository = new ProductRepository(db);
  });

  beforeEach(() => {
    db.exec('DELETE FROM inventory_history');
    db.exec('DELETE FROM products');
    db.exec('DELETE FROM categories');
    seedTestData(db);
  });

  afterAll(() => {
    db.close();
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = await repository.findAll();
      
      expect(products).toHaveLength(3);
      expect(products[0]).toHaveProperty('id');
      expect(products[0]).toHaveProperty('name');
    });

    it('should filter by categoryId', async () => {
      const products = await repository.findAll({ categoryId: 1 });
      
      expect(products).toHaveLength(2);
      expect(products.every(p => p.categoryId === 1)).toBe(true);
    });

    it('should filter by price range', async () => {
      const products = await repository.findAll({ 
        minPrice: 2.90, 
        maxPrice: 3.00 
      });
      
      expect(products).toHaveLength(1);
      expect(products[0].productCode).toBe('BEV-001');
    });

    it('should search by name', async () => {
      const products = await repository.findAll({ search: 'cola' });
      
      expect(products).toHaveLength(1);
      expect(products[0].name).toContain('Coca-Cola');
    });

    it('should sort by specified field', async () => {
      const products = await repository.findAll({ 
        sort: 'price', 
        order: 'asc' 
      });
      
      expect(products[0].price).toBeLessThanOrEqual(products[1].price);
    });

    it('should paginate results', async () => {
      const page1 = await repository.findAll({ page: 1, limit: 2 });
      const page2 = await repository.findAll({ page: 2, limit: 2 });
      
      expect(page1).toHaveLength(2);
      expect(page2).toHaveLength(1);
    });
  });

  describe('findById', () => {
    it('should return product when found', async () => {
      const product = await repository.findById(1);
      
      expect(product).toBeDefined();
      expect(product?.id).toBe(1);
      expect(product?.name).toBe('Coca-Cola');
    });

    it('should return null when not found', async () => {
      const product = await repository.findById(999);
      
      expect(product).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const data = ProductFactory.build({ categoryId: 1 });
      
      const product = await repository.create(data);
      
      expect(product.id).toBeDefined();
      expect(product.name).toBe(data.name);
      expect(product.productCode).toBe(data.productCode);
    });

    it('should throw error on duplicate product code', async () => {
      const data = ProductFactory.build({ 
        productCode: 'BEV-001',
        categoryId: 1 
      });
      
      await expect(repository.create(data))
        .rejects
        .toThrow();
    });
  });

  describe('update', () => {
    it('should update product fields', async () => {
      const updated = await repository.update(1, { 
        name: 'Updated Name',
        price: 5.99 
      });
      
      expect(updated.name).toBe('Updated Name');
      expect(updated.price).toBe(5.99);
    });

    it('should not update quantity directly', async () => {
      const before = await repository.findById(1);
      await repository.update(1, { name: 'New Name' });
      const after = await repository.findById(1);
      
      expect(after?.quantity).toBe(before?.quantity);
    });
  });

  describe('delete', () => {
    it('should delete product', async () => {
      await repository.delete(1);
      
      const product = await repository.findById(1);
      expect(product).toBeNull();
    });
  });

  describe('updateQuantity', () => {
    it('should update product quantity', async () => {
      await repository.updateQuantity(1, 200);
      
      const product = await repository.findById(1);
      expect(product?.quantity).toBe(200);
    });
  });
});
```

---

### Integration Tests Examples

```typescript
// backend/tests/integration/products.test.ts

import request from 'supertest';
import { app } from '@/app';
import { createTestDatabase, seedTestData } from '../helpers/database.helper';
import { ProductFactory } from '../helpers/factory.helper';

describe('Products API', () => {
  beforeEach(() => {
    seedTestData(db);
  });

  describe('GET /api/products', () => {
    it('should return list of products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.pagination).toBeDefined();
    });

    it('should filter by category', async () => {
      const response = await request(app)
        .get('/api/products?categoryId=1')
        .expect(200);

      expect(response.body.data.every(p => p.categoryId === 1)).toBe(true);
    });

    it('should search products', async () => {
      const response = await request(app)
        .get('/api/products?search=cola')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toContain('Coca-Cola');
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return product by id', async () => {
      const response = await request(app)
        .get('/api/products/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(1);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('PRODUCT_NOT_FOUND');
    });
  });

  describe('POST /api/products', () => {
    it('should create new product', async () => {
      const productData = ProductFactory.build({ categoryId: 1 });

      const response = await request(app)
        .post('/api/products')
        .send(productData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(productData.name);
    });

    it('should return validation error for missing fields', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({ name: 'Test' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.details).toContainEqual(
        expect.objectContaining({ field: 'productCode' })
      );
    });

    it('should return 409 for duplicate product code', async () => {
      const response = await request(app)
        .post('/api/products')
        .send(ProductFactory.build({ productCode: 'BEV-001', categoryId: 1 }))
        .expect(409);

      expect(response.body.error.code).toBe('DUPLICATE_PRODUCT_CODE');
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update product', async () => {
      const response = await request(app)
        .put('/api/products/1')
        .send({ name: 'Updated Name', price: 5.99 })
        .expect(200);

      expect(response.body.data.name).toBe('Updated Name');
      expect(response.body.data.price).toBe(5.99);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete product', async () => {
      await request(app)
        .delete('/api/products/1')
        .expect(200);

      await request(app)
        .get('/api/products/1')
        .expect(404);
    });
  });
});
```

```typescript
// backend/tests/integration/inventory.test.ts

import request from 'supertest';
import { app } from '@/app';

describe('Inventory API', () => {
  describe('POST /api/inventory/:productId/increase', () => {
    it('should increase stock', async () => {
      const response = await request(app)
        .post('/api/inventory/1/increase')
        .send({ quantity: 50, reason: 'New shipment' })
        .expect(200);

      expect(response.body.data.product.quantity).toBe(150);
      expect(response.body.data.change.type).toBe('STOCK_IN');
    });

    it('should reject non-positive quantity', async () => {
      await request(app)
        .post('/api/inventory/1/increase')
        .send({ quantity: 0 })
        .expect(400);
    });
  });

  describe('POST /api/inventory/:productId/decrease', () => {
    it('should decrease stock', async () => {
      const response = await request(app)
        .post('/api/inventory/1/decrease')
        .send({ quantity: 30, reason: 'Sale' })
        .expect(200);

      expect(response.body.data.product.quantity).toBe(70);
      expect(response.body.data.change.type).toBe('STOCK_OUT');
    });

    it('should reject when quantity exceeds available', async () => {
      const response = await request(app)
        .post('/api/inventory/1/decrease')
        .send({ quantity: 500 })
        .expect(400);

      expect(response.body.error.code).toBe('INSUFFICIENT_STOCK');
    });
  });

  describe('GET /api/inventory/:productId/history', () => {
    it('should return inventory history', async () => {
      // First make some changes
      await request(app)
        .post('/api/inventory/1/increase')
        .send({ quantity: 10 });
      
      await request(app)
        .post('/api/inventory/1/decrease')
        .send({ quantity: 5 });

      const response = await request(app)
        .get('/api/inventory/1/history')
        .expect(200);

      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
    });
  });
});
```

---

## Frontend Testing

### Technology Stack

| Tool                    | Purpose                              |
| ----------------------- | ------------------------------------ |
| Vitest                  | Test runner (Vite-native)            |
| React Testing Library   | Component testing utilities          |
| MSW                     | API mocking                          |
| @testing-library/user-event | User interaction simulation     |

### Jest/Vitest Configuration

```typescript
// frontend/vitest.config.ts

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        'src/main.tsx',
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Test Setup

```typescript
// frontend/tests/setup.ts

import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './mocks/server';

// Start MSW server
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
});
```

### MSW Handlers

```typescript
// frontend/tests/mocks/handlers.ts

import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/products', () => {
    return HttpResponse.json({
      success: true,
      data: [
        { id: 1, name: 'Product 1', price: 9.99, quantity: 100 },
        { id: 2, name: 'Product 2', price: 19.99, quantity: 50 },
      ],
      pagination: { page: 1, limit: 20, total: 2, totalPages: 1 },
    });
  }),
  
  http.get('/api/products/:id', ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: { id: params.id, name: 'Test Product', price: 9.99, quantity: 100 },
    });
  }),
  
  http.post('/api/products', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: { id: 1, ...body },
    }, { status: 201 });
  }),
];
```

### Component Tests

```typescript
// frontend/tests/components/ProductForm.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductForm } from '@/components/forms/ProductForm';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('ProductForm', () => {
  it('renders all form fields', () => {
    render(<ProductForm onSubmit={vi.fn()} />, { wrapper });
    
    expect(screen.getByLabelText(/product name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/product code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    render(<ProductForm onSubmit={vi.fn()} />, { wrapper });
    
    await user.click(screen.getByRole('button', { name: /save/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  it('calls onSubmit with form data when valid', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    
    render(<ProductForm onSubmit={onSubmit} />, { wrapper });
    
    await user.type(screen.getByLabelText(/product name/i), 'Test Product');
    await user.type(screen.getByLabelText(/product code/i), 'TST-001');
    await user.type(screen.getByLabelText(/price/i), '9.99');
    await user.selectOptions(screen.getByLabelText(/category/i), '1');
    
    await user.click(screen.getByRole('button', { name: /save/i }));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Product',
          productCode: 'TST-001',
          price: 9.99,
        })
      );
    });
  });

  it('populates form with initial data', () => {
    const initialData = {
      name: 'Existing Product',
      productCode: 'EXI-001',
      price: 15.99,
      categoryId: 2,
    };
    
    render(<ProductForm initialData={initialData} onSubmit={vi.fn()} />, { wrapper });
    
    expect(screen.getByLabelText(/product name/i)).toHaveValue('Existing Product');
    expect(screen.getByLabelText(/price/i)).toHaveValue(15.99);
  });
});
```

### Hook Tests

```typescript
// frontend/tests/hooks/useProducts.test.tsx

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProducts, useCreateProduct } from '@/hooks/api/useProducts';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useProducts', () => {
  it('fetches products successfully', async () => {
    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(2);
  });

  it('handles loading state', () => {
    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });
});

describe('useCreateProduct', () => {
  it('creates product successfully', async () => {
    const { result } = renderHook(() => useCreateProduct(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      name: 'New Product',
      productCode: 'NEW-001',
      price: 29.99,
      categoryId: 1,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
```

---

## Running Tests

### Backend

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific file
npm test -- products.service.test.ts

# Run in watch mode
npm run test:watch

# Run only unit tests
npm test -- --testPathPattern=unit

# Run only integration tests
npm test -- --testPathPattern=integration
```

### Frontend

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run with UI
npm run test:ui
```

---

## CI/CD Integration

```yaml
# .github/workflows/test.yml

name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install dependencies
        working-directory: ./backend
        run: npm ci
      
      - name: Run tests
        working-directory: ./backend
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          directory: ./backend/coverage

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci
      
      - name: Run tests
        working-directory: ./frontend
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          directory: ./frontend/coverage
```

---

## Test Checklist

### Before Committing

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Coverage meets minimum threshold (70%)
- [ ] No skipped tests without reason
- [ ] New code has corresponding tests

### Code Review

- [ ] Tests cover happy path
- [ ] Tests cover error cases
- [ ] Tests cover edge cases
- [ ] Tests are readable and maintainable
- [ ] No unnecessary mocking

