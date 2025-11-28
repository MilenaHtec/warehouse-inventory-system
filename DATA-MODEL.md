# Data Model Documentation

## Overview

This document defines the complete data model for the Warehouse Inventory System. The model is designed to support:

- Product management (CRUD operations)
- Category organization
- Stock quantity tracking with validation
- Complete audit trail of all inventory changes

---

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│    ┌──────────────────┐         ┌──────────────────┐                       │
│    │    categories    │         │  inventory_history│                       │
│    ├──────────────────┤         ├──────────────────┤                       │
│    │ PK id            │         │ PK id            │                       │
│    │    name          │         │ FK product_id    │◄──────┐               │
│    │    description   │         │    change_type   │       │               │
│    │    created_at    │         │    quantity_before│       │               │
│    │    updated_at    │         │    quantity_after│       │               │
│    └────────┬─────────┘         │    quantity_change│       │               │
│             │                   │    reason        │       │               │
│             │ 1:N               │    created_at    │       │               │
│             ▼                   └──────────────────┘       │               │
│    ┌──────────────────┐                                   │               │
│    │     products     │                                   │               │
│    ├──────────────────┤                                   │ 1:N           │
│    │ PK id            │───────────────────────────────────┘               │
│    │    name          │                                                   │
│    │    product_code  │                                                   │
│    │    price         │                                                   │
│    │    quantity      │                                                   │
│    │ FK category_id   │                                                   │
│    │    created_at    │                                                   │
│    │    updated_at    │                                                   │
│    └──────────────────┘                                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Entities

### 1. Category

Represents product categories for organizing inventory items.

#### Schema Definition

| Column      | Type         | Constraints                    | Description                        |
| ----------- | ------------ | ------------------------------ | ---------------------------------- |
| id          | INTEGER      | PRIMARY KEY, AUTOINCREMENT     | Unique identifier                  |
| name        | VARCHAR(100) | NOT NULL, UNIQUE               | Category name                      |
| description | TEXT         | NULLABLE                       | Optional category description      |
| created_at  | DATETIME     | NOT NULL, DEFAULT CURRENT_TIME | Record creation timestamp          |
| updated_at  | DATETIME     | NOT NULL, DEFAULT CURRENT_TIME | Last update timestamp              |

#### SQL Definition

```sql
CREATE TABLE categories (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster name lookups
CREATE INDEX idx_categories_name ON categories(name);
```

#### Example Data

| id | name       | description                    | created_at          |
| -- | ---------- | ------------------------------ | ------------------- |
| 1  | Beverages  | Drinks and liquid products     | 2024-01-15 10:00:00 |
| 2  | Snacks     | Chips, cookies, and treats     | 2024-01-15 10:00:00 |
| 3  | Household  | Cleaning and home supplies     | 2024-01-15 10:00:00 |

#### Business Rules

- Category name must be unique
- Category cannot be deleted if products are associated with it
- Deleting a category requires reassigning or removing associated products first

---

### 2. Product

Represents inventory items with their details and current stock quantity.

#### Schema Definition

| Column       | Type          | Constraints                         | Description                     |
| ------------ | ------------- | ----------------------------------- | ------------------------------- |
| id           | INTEGER       | PRIMARY KEY, AUTOINCREMENT          | Unique identifier               |
| name         | VARCHAR(200)  | NOT NULL                            | Product name                    |
| product_code | VARCHAR(50)   | NOT NULL, UNIQUE                    | Unique product SKU/code         |
| price        | DECIMAL(10,2) | NOT NULL, CHECK(price >= 0)         | Product price (non-negative)    |
| quantity     | INTEGER       | NOT NULL, DEFAULT 0, CHECK(qty >= 0)| Current stock quantity          |
| category_id  | INTEGER       | NOT NULL, FOREIGN KEY               | Reference to category           |
| created_at   | DATETIME      | NOT NULL, DEFAULT CURRENT_TIME      | Record creation timestamp       |
| updated_at   | DATETIME      | NOT NULL, DEFAULT CURRENT_TIME      | Last update timestamp           |

#### SQL Definition

```sql
CREATE TABLE products (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         VARCHAR(200) NOT NULL,
    product_code VARCHAR(50) NOT NULL UNIQUE,
    price        DECIMAL(10,2) NOT NULL CHECK(price >= 0),
    quantity     INTEGER NOT NULL DEFAULT 0 CHECK(quantity >= 0),
    category_id  INTEGER NOT NULL,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- Indexes for common queries
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_code ON products(product_code);
CREATE INDEX idx_products_name ON products(name);
```

#### Example Data

| id | name           | product_code | price | quantity | category_id |
| -- | -------------- | ------------ | ----- | -------- | ----------- |
| 1  | Coca-Cola 2L   | BEV-001      | 2.99  | 150      | 1           |
| 2  | Pepsi 2L       | BEV-002      | 2.89  | 120      | 1           |
| 3  | Lay's Classic  | SNK-001      | 3.49  | 80       | 2           |
| 4  | Dish Soap      | HOU-001      | 4.99  | 45       | 3           |

#### Business Rules

- Product code must be unique across all products
- Price cannot be negative
- Quantity cannot go below zero (validation required on stock decrease)
- Every product must belong to a category
- Product code format: `{CATEGORY_PREFIX}-{NUMBER}` (recommended)

---

### 3. Inventory History

Audit log tracking all stock changes for compliance and reporting.

#### Schema Definition

| Column          | Type        | Constraints                    | Description                      |
| --------------- | ----------- | ------------------------------ | -------------------------------- |
| id              | INTEGER     | PRIMARY KEY, AUTOINCREMENT     | Unique identifier                |
| product_id      | INTEGER     | NOT NULL, FOREIGN KEY          | Reference to product             |
| change_type     | VARCHAR(20) | NOT NULL                       | Type of change (enum)            |
| quantity_before | INTEGER     | NOT NULL                       | Stock level before change        |
| quantity_after  | INTEGER     | NOT NULL                       | Stock level after change         |
| quantity_change | INTEGER     | NOT NULL                       | Amount changed (+/-)             |
| reason          | TEXT        | NULLABLE                       | Optional reason for change       |
| created_at      | DATETIME    | NOT NULL, DEFAULT CURRENT_TIME | When the change occurred         |

#### SQL Definition

```sql
CREATE TABLE inventory_history (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id      INTEGER NOT NULL,
    change_type     VARCHAR(20) NOT NULL CHECK(
        change_type IN ('STOCK_IN', 'STOCK_OUT', 'ADJUSTMENT', 'INITIAL')
    ),
    quantity_before INTEGER NOT NULL,
    quantity_after  INTEGER NOT NULL,
    quantity_change INTEGER NOT NULL,
    reason          TEXT,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- Indexes for common queries
CREATE INDEX idx_inventory_history_product ON inventory_history(product_id);
CREATE INDEX idx_inventory_history_date ON inventory_history(created_at);
CREATE INDEX idx_inventory_history_type ON inventory_history(change_type);
```

#### Change Type Enumeration

| Value      | Description                         | quantity_change |
| ---------- | ----------------------------------- | --------------- |
| STOCK_IN   | Stock received/added                | Positive (+)    |
| STOCK_OUT  | Stock sold/removed                  | Negative (-)    |
| ADJUSTMENT | Manual inventory correction         | +/- any         |
| INITIAL    | Initial stock when product created  | Positive (+)    |

#### Example Data

| id | product_id | change_type | qty_before | qty_after | qty_change | reason            | created_at          |
| -- | ---------- | ----------- | ---------- | --------- | ---------- | ----------------- | ------------------- |
| 1  | 1          | INITIAL     | 0          | 100       | +100       | Initial stock     | 2024-01-15 10:30:00 |
| 2  | 1          | STOCK_IN    | 100        | 150       | +50        | Shipment received | 2024-01-16 14:00:00 |
| 3  | 1          | STOCK_OUT   | 150        | 140       | -10        | Sale              | 2024-01-17 09:15:00 |
| 4  | 1          | ADJUSTMENT  | 140        | 138       | -2         | Damaged items     | 2024-01-18 11:00:00 |

#### Business Rules

- History records are immutable (never updated or deleted)
- Every stock change must create a history record
- `quantity_change` = `quantity_after` - `quantity_before`
- Records should be created in a transaction with the product update

---

## TypeScript Type Definitions

### Entities

```typescript
// Category Entity
interface Category {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Product Entity
interface Product {
  id: number;
  name: string;
  productCode: string;
  price: number;
  quantity: number;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
}

// Product with Category (joined)
interface ProductWithCategory extends Product {
  category: Category;
}

// Inventory History Entity
interface InventoryHistory {
  id: number;
  productId: number;
  changeType: ChangeType;
  quantityBefore: number;
  quantityAfter: number;
  quantityChange: number;
  reason: string | null;
  createdAt: Date;
}

// Change Type Enum
type ChangeType = 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT' | 'INITIAL';
```

### DTOs (Data Transfer Objects)

```typescript
// Create Category
interface CreateCategoryDto {
  name: string;
  description?: string;
}

// Update Category
interface UpdateCategoryDto {
  name?: string;
  description?: string;
}

// Create Product
interface CreateProductDto {
  name: string;
  productCode: string;
  price: number;
  quantity?: number;  // defaults to 0
  categoryId: number;
}

// Update Product
interface UpdateProductDto {
  name?: string;
  productCode?: string;
  price?: number;
  categoryId?: number;
}

// Stock Change
interface StockChangeDto {
  quantity: number;    // positive integer
  reason?: string;
}

// Stock Adjustment
interface StockAdjustmentDto {
  newQuantity: number;
  reason: string;      // required for adjustments
}
```

### Query/Filter Types

```typescript
// Product Filter Options
interface ProductFilter {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
  maxQuantity?: number;
  search?: string;  // searches name and product_code
}

// Sort Options
interface SortOptions {
  field: 'name' | 'price' | 'quantity' | 'createdAt' | 'productCode';
  order: 'asc' | 'desc';
}

// Pagination
interface PaginationOptions {
  page: number;
  limit: number;
}

// Paginated Response
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

---

## Validation Rules

### Category Validation

```typescript
const categorySchema = {
  name: {
    type: 'string',
    minLength: 1,
    maxLength: 100,
    required: true
  },
  description: {
    type: 'string',
    maxLength: 500,
    required: false
  }
};
```

### Product Validation

```typescript
const productSchema = {
  name: {
    type: 'string',
    minLength: 1,
    maxLength: 200,
    required: true
  },
  productCode: {
    type: 'string',
    minLength: 1,
    maxLength: 50,
    pattern: /^[A-Z]{3}-\d{3,}$/,  // e.g., BEV-001
    required: true
  },
  price: {
    type: 'number',
    minimum: 0,
    multipleOf: 0.01,  // 2 decimal places
    required: true
  },
  quantity: {
    type: 'integer',
    minimum: 0,
    required: false,
    default: 0
  },
  categoryId: {
    type: 'integer',
    minimum: 1,
    required: true
  }
};
```

### Stock Change Validation

```typescript
const stockChangeSchema = {
  quantity: {
    type: 'integer',
    minimum: 1,          // must change by at least 1
    required: true
  },
  reason: {
    type: 'string',
    maxLength: 500,
    required: false
  }
};

// Additional validation for decrease:
// currentQuantity - changeQuantity >= 0
```

---

## Database Indexes Summary

| Table             | Index Name                    | Columns      | Purpose                          |
| ----------------- | ----------------------------- | ------------ | -------------------------------- |
| categories        | idx_categories_name           | name         | Fast name lookups                |
| products          | idx_products_category         | category_id  | Category filtering               |
| products          | idx_products_code             | product_code | Code lookups                     |
| products          | idx_products_name             | name         | Name search                      |
| inventory_history | idx_inventory_history_product | product_id   | Product history queries          |
| inventory_history | idx_inventory_history_date    | created_at   | Date range queries               |
| inventory_history | idx_inventory_history_type    | change_type  | Type filtering                   |

---

## Query Examples

### Get Products by Category with Total Count

```sql
SELECT 
    c.id AS category_id,
    c.name AS category_name,
    COUNT(p.id) AS product_count,
    COALESCE(SUM(p.quantity), 0) AS total_stock
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY c.name;
```

### Get Inventory History with Product Details

```sql
SELECT 
    ih.*,
    p.name AS product_name,
    p.product_code
FROM inventory_history ih
JOIN products p ON ih.product_id = p.id
WHERE ih.created_at >= date('now', '-30 days')
ORDER BY ih.created_at DESC;
```

### Search Products

```sql
SELECT p.*, c.name AS category_name
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.name LIKE '%search_term%' 
   OR p.product_code LIKE '%search_term%'
ORDER BY p.name
LIMIT 20 OFFSET 0;
```

### Low Stock Alert Query

```sql
SELECT p.*, c.name AS category_name
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.quantity <= 10  -- threshold
ORDER BY p.quantity ASC;
```

---

## Migration Strategy

### Initial Migration (001_initial_schema.sql)

```sql
-- Enable foreign keys (SQLite)
PRAGMA foreign_keys = ON;

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         VARCHAR(200) NOT NULL,
    product_code VARCHAR(50) NOT NULL UNIQUE,
    price        DECIMAL(10,2) NOT NULL CHECK(price >= 0),
    quantity     INTEGER NOT NULL DEFAULT 0 CHECK(quantity >= 0),
    category_id  INTEGER NOT NULL,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- Create inventory_history table
CREATE TABLE IF NOT EXISTS inventory_history (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id      INTEGER NOT NULL,
    change_type     VARCHAR(20) NOT NULL,
    quantity_before INTEGER NOT NULL,
    quantity_after  INTEGER NOT NULL,
    quantity_change INTEGER NOT NULL,
    reason          TEXT,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_code ON products(product_code);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_inventory_history_product ON inventory_history(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_history_date ON inventory_history(created_at);
CREATE INDEX IF NOT EXISTS idx_inventory_history_type ON inventory_history(change_type);
```

### Seed Data (002_seed_categories.sql)

```sql
INSERT INTO categories (name, description) VALUES
    ('Beverages', 'Drinks and liquid products'),
    ('Snacks', 'Chips, cookies, and treats'),
    ('Household', 'Cleaning and home supplies'),
    ('Dairy', 'Milk, cheese, and dairy products'),
    ('Frozen', 'Frozen foods and ice cream');
```

---

## Data Integrity Rules

| Rule                          | Implementation                                |
| ----------------------------- | --------------------------------------------- |
| No orphan products            | FK constraint with ON DELETE RESTRICT         |
| Non-negative quantities       | CHECK constraint on quantity >= 0             |
| Non-negative prices           | CHECK constraint on price >= 0                |
| Unique product codes          | UNIQUE constraint on product_code             |
| Unique category names         | UNIQUE constraint on name                     |
| Audit trail preservation      | No UPDATE/DELETE on inventory_history         |
| Stock decrease validation     | Application-level check before update         |
| Transactional stock updates   | Product + History in single transaction       |

