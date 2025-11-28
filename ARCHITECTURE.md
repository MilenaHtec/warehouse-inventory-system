# Architecture Document

## System Overview

Warehouse Inventory System is a backend application designed following **Layered Architecture** principles. The system enables management of products, categories, and inventory with a complete audit trail of all changes.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│                    (REST API Consumers)                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Controllers │  │  Middleware │  │  Error Handler (Global) │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       BUSINESS LAYER                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ Product Service │  │ Category Service │  │ Inventory Svc   │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│  ┌─────────────────┐  ┌─────────────────┐                       │
│  │ Report Service  │  │  Audit Service  │                       │
│  └─────────────────┘  └─────────────────┘                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ Product Repo    │  │ Category Repo   │  │ Inventory Repo  │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│  ┌─────────────────┐                                            │
│  │ Audit Log Repo  │                                            │
│  └─────────────────┘                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                             │
│                         (SQLite)                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                            API Gateway                                  │
│                                                                        │
│  /api/products    /api/categories    /api/inventory    /api/reports   │
└────────────────────────────────────────────────────────────────────────┘
         │                  │                  │               │
         ▼                  ▼                  ▼               ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Product    │   │   Category   │   │  Inventory   │   │    Report    │
│  Controller  │   │  Controller  │   │  Controller  │   │  Controller  │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
         │                  │                  │               │
         ▼                  ▼                  ▼               ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Product    │   │   Category   │   │  Inventory   │   │    Report    │
│   Service    │   │   Service    │   │   Service    │   │   Service    │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
         │                  │                  │               │
         └──────────────────┼──────────────────┼───────────────┘
                            ▼                  ▼
                    ┌──────────────┐   ┌──────────────┐
                    │    Audit     │   │   Logger     │
                    │   Service    │   │   Service    │
                    └──────────────┘   └──────────────┘
```

---

## Database Schema (ERD)

```
┌─────────────────────────────────┐
│           categories            │
├─────────────────────────────────┤
│ PK │ id          │ INTEGER      │
│    │ name        │ VARCHAR(100) │
│    │ description │ TEXT         │
│    │ created_at  │ DATETIME     │
│    │ updated_at  │ DATETIME     │
└─────────────────────────────────┘
              │
              │ 1:N
              ▼
┌─────────────────────────────────┐
│            products             │
├─────────────────────────────────┤
│ PK │ id           │ INTEGER     │
│    │ name         │ VARCHAR(200)│
│    │ product_code │ VARCHAR(50) │
│    │ price        │ DECIMAL     │
│    │ quantity     │ INTEGER     │
│ FK │ category_id  │ INTEGER     │
│    │ created_at   │ DATETIME    │
│    │ updated_at   │ DATETIME    │
└─────────────────────────────────┘
              │
              │ 1:N
              ▼
┌─────────────────────────────────┐
│        inventory_history        │
├─────────────────────────────────┤
│ PK │ id              │ INTEGER  │
│ FK │ product_id      │ INTEGER  │
│    │ change_type     │ VARCHAR  │
│    │ quantity_before │ INTEGER  │
│    │ quantity_after  │ INTEGER  │
│    │ quantity_change │ INTEGER  │
│    │ reason          │ TEXT     │
│    │ created_at      │ DATETIME │
└─────────────────────────────────┘
```

### Table Descriptions

| Table               | Description                                          |
| ------------------- | ---------------------------------------------------- |
| `categories`        | Product categories (Beverages, Snacks, Household...) |
| `products`          | Core product information and current stock quantity  |
| `inventory_history` | Audit log of all inventory changes                   |

### change_type Enum Values

- `STOCK_IN` - Stock increase
- `STOCK_OUT` - Stock decrease
- `ADJUSTMENT` - Inventory correction
- `INITIAL` - Initial stock

---

## Directory Structure

```
warehouse-inventory-system/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── product.controller.ts
│   │   ├── category.controller.ts
│   │   ├── inventory.controller.ts
│   │   └── report.controller.ts
│   │
│   ├── services/             # Business logic
│   │   ├── product.service.ts
│   │   ├── category.service.ts
│   │   ├── inventory.service.ts
│   │   ├── report.service.ts
│   │   └── audit.service.ts
│   │
│   ├── repositories/         # Data access
│   │   ├── product.repository.ts
│   │   ├── category.repository.ts
│   │   ├── inventory.repository.ts
│   │   └── audit.repository.ts
│   │
│   ├── models/               # Data models/entities
│   │   ├── product.model.ts
│   │   ├── category.model.ts
│   │   └── inventory-history.model.ts
│   │
│   ├── middleware/           # Express middleware
│   │   ├── error-handler.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── logger.middleware.ts
│   │
│   ├── utils/                # Utility functions
│   │   ├── logger.ts
│   │   ├── errors.ts
│   │   └── validators.ts
│   │
│   ├── config/               # Configuration
│   │   ├── database.ts
│   │   └── app.config.ts
│   │
│   ├── routes/               # Route definitions
│   │   ├── index.ts
│   │   ├── product.routes.ts
│   │   ├── category.routes.ts
│   │   ├── inventory.routes.ts
│   │   └── report.routes.ts
│   │
│   ├── types/                # TypeScript types
│   │   └── index.ts
│   │
│   └── app.ts                # Application entry point
│
├── tests/                    # Test files
│   ├── unit/
│   │   ├── services/
│   │   └── repositories/
│   └── integration/
│
├── database/
│   ├── migrations/           # Database migrations
│   └── seeds/                # Seed data
│
├── logs/                     # Application logs
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

---

## Technology Stack

| Layer      | Technology         | Reason                                         |
| ---------- | ------------------ | ---------------------------------------------- |
| Runtime    | **Node.js** (v18+) | Simple, fast development                       |
| Language   | **TypeScript**     | Type safety, better maintainability            |
| Framework  | **Express.js**     | Lightweight, flexible                          |
| Database   | **SQLite**         | Lightweight, zero-config, local database       |
| ORM        | **better-sqlite3** | Sync API, fast, TypeScript support             |
| Validation | **Zod**            | Runtime validation with TypeScript integration |
| Testing    | **Jest**           | Feature-rich, excellent documentation          |
| Logging    | **Winston**        | Flexible logging with multiple transports      |

---

## API Endpoints Design

### Products

| Method | Endpoint               | Description                                |
| ------ | ---------------------- | ------------------------------------------ |
| GET    | `/api/products`        | List all products (with filtering/sorting) |
| GET    | `/api/products/:id`    | Get single product details                 |
| POST   | `/api/products`        | Create new product                         |
| PUT    | `/api/products/:id`    | Update product                             |
| DELETE | `/api/products/:id`    | Delete product                             |
| GET    | `/api/products/search` | Search products                            |

### Categories

| Method | Endpoint                       | Description              |
| ------ | ------------------------------ | ------------------------ |
| GET    | `/api/categories`              | List all categories      |
| GET    | `/api/categories/:id`          | Get category details     |
| POST   | `/api/categories`              | Create category          |
| PUT    | `/api/categories/:id`          | Update category          |
| DELETE | `/api/categories/:id`          | Delete category          |
| GET    | `/api/categories/:id/products` | Get products in category |

### Inventory

| Method | Endpoint                             | Description                    |
| ------ | ------------------------------------ | ------------------------------ |
| POST   | `/api/inventory/:productId/increase` | Increase stock                 |
| POST   | `/api/inventory/:productId/decrease` | Decrease stock                 |
| GET    | `/api/inventory/:productId/history`  | Get change history for product |

### Reports

| Method | Endpoint                         | Description             |
| ------ | -------------------------------- | ----------------------- |
| GET    | `/api/reports/stock-by-category` | Total stock by category |
| GET    | `/api/reports/inventory-history` | Complete change history |
| GET    | `/api/reports/low-stock`         | Products with low stock |

---

## Request/Response Flow

```
┌──────────┐    ┌────────────┐    ┌─────────────┐    ┌────────────┐
│  Client  │───▶│ Middleware │───▶│  Controller │───▶│  Service   │
└──────────┘    └────────────┘    └─────────────┘    └────────────┘
                     │                   │                  │
                     │                   │                  ▼
                     │                   │           ┌────────────┐
                     │                   │           │ Repository │
                     │                   │           └────────────┘
                     │                   │                  │
                     │                   │                  ▼
                     │                   │           ┌────────────┐
                     │                   │           │  Database  │
                     │                   │           └────────────┘
                     │                   │                  │
                     ◀───────────────────┴──────────────────┘
                           Response (JSON)
```

---

## Error Handling Strategy

### Error Types

```typescript
// Custom Error Classes
├── AppError (base class)
│   ├── ValidationError (400)
│   ├── NotFoundError (404)
│   ├── ConflictError (409)
│   └── DatabaseError (500)
```

### Global Error Handler

```
┌─────────────────────────────────────────────────────────────┐
│                   Global Error Handler                       │
├─────────────────────────────────────────────────────────────┤
│  1. Catch all unhandled errors                              │
│  2. Log error details (Winston)                             │
│  3. Transform to consistent error response                  │
│  4. Return appropriate HTTP status code                     │
│  5. Hide internal details in production                     │
└─────────────────────────────────────────────────────────────┘
```

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Stock quantity cannot be negative",
    "details": [
      {
        "field": "quantity",
        "message": "Must be greater than or equal to 0"
      }
    ]
  }
}
```

---

## Testing Strategy

### Coverage Target: 70%+

```
┌─────────────────────────────────────────────────────────────┐
│                    Test Pyramid                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    ┌─────────┐                              │
│                   │   E2E   │        (Few)                  │
│                  └─────────┘                                │
│               ┌───────────────┐                             │
│              │  Integration  │     (Some)                   │
│             └───────────────┘                               │
│          ┌─────────────────────┐                            │
│         │     Unit Tests      │    (Many)                   │
│        └─────────────────────┘                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Test Focus Areas

| Layer        | Test Type        | Coverage Focus                         |
| ------------ | ---------------- | -------------------------------------- |
| Services     | Unit             | Business logic, validation, edge cases |
| Repositories | Unit/Integration | CRUD operations, queries               |
| Controllers  | Integration      | Request/Response handling              |
| Middleware   | Unit             | Error handling, validation             |

---

## Data Flow Examples

### Stock Decrease Operation

```
1. Request: POST /api/inventory/:productId/decrease
   Body: { quantity: 5, reason: "Sale" }

2. Controller: Validates request params

3. Service:
   ├── Fetch current product
   ├── Validate: newQuantity >= 0
   ├── Update product quantity
   ├── Create inventory_history record
   └── Return updated product

4. Response:
   {
     "success": true,
     "data": {
       "product": { ... },
       "previousQuantity": 10,
       "newQuantity": 5
     }
   }
```

---

## Security Considerations

| Concern          | Solution                             |
| ---------------- | ------------------------------------ |
| Input Validation | Zod schemas on all endpoints         |
| SQL Injection    | Parameterized queries (ORM)          |
| Error Exposure   | Generic error messages in production |
| Logging          | No sensitive data in logs            |

---

## Scalability Notes

Current architecture is designed for single-instance deployment with SQLite. For future scaling:

1. **Database Migration**: SQLite → PostgreSQL/MySQL
2. **Caching Layer**: Redis for frequently accessed data
3. **API Rate Limiting**: Express rate-limit middleware
4. **Horizontal Scaling**: Stateless design enables easy scaling

---

## Next Steps

1. [ ] **DATA-MODEL.md** - Detailed data model documentation
2. [ ] **API.md** - Detailed API documentation with examples
3. [ ] **TESTING.md** - Test plan and strategy
4. [ ] **Project Setup** - Initialization and configuration
