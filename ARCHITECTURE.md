# Architecture Document

## System Overview

Warehouse Inventory System je backend aplikacija dizajnirana po principima **Layered Architecture** (slojevita arhitektura). Sistem omogućava upravljanje proizvodima, kategorijama i zalihama sa kompletnim audit trail-om svih promena.

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

### Opis Tabela

| Tabela | Opis |
|--------|------|
| `categories` | Kategorije proizvoda (Beverages, Snacks, Household...) |
| `products` | Osnovne informacije o proizvodima i trenutna količina |
| `inventory_history` | Audit log svih promena zaliha |

### change_type Enum Values
- `STOCK_IN` - Povećanje zaliha
- `STOCK_OUT` - Smanjenje zaliha
- `ADJUSTMENT` - Korekcija inventara
- `INITIAL` - Početno stanje

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

| Layer | Technology | Razlog |
|-------|------------|--------|
| Runtime | **Node.js** (v18+) | Jednostavan, brz development |
| Language | **TypeScript** | Type safety, bolja maintainability |
| Framework | **Express.js** | Lightweight, fleksibilan |
| Database | **SQLite** | Lightweight, zero-config, lokalna baza |
| ORM | **better-sqlite3** | Sync API, brz, TypeScript support |
| Validation | **Zod** | Runtime validation sa TypeScript integracija |
| Testing | **Jest** | Feature-rich, dobra dokumentacija |
| Logging | **Winston** | Fleksibilan logging sa više transporta |

---

## API Endpoints Design

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Lista svih proizvoda (sa filtering/sorting) |
| GET | `/api/products/:id` | Detalji jednog proizvoda |
| POST | `/api/products` | Kreiranje novog proizvoda |
| PUT | `/api/products/:id` | Update proizvoda |
| DELETE | `/api/products/:id` | Brisanje proizvoda |
| GET | `/api/products/search` | Pretraga proizvoda |

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Lista svih kategorija |
| GET | `/api/categories/:id` | Detalji kategorije |
| POST | `/api/categories` | Kreiranje kategorije |
| PUT | `/api/categories/:id` | Update kategorije |
| DELETE | `/api/categories/:id` | Brisanje kategorije |
| GET | `/api/categories/:id/products` | Proizvodi u kategoriji |

### Inventory

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/inventory/:productId/increase` | Povećanje zaliha |
| POST | `/api/inventory/:productId/decrease` | Smanjenje zaliha |
| GET | `/api/inventory/:productId/history` | Istorija promena za proizvod |

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/stock-by-category` | Ukupne zalihe po kategoriji |
| GET | `/api/reports/inventory-history` | Kompletna istorija promena |
| GET | `/api/reports/low-stock` | Proizvodi sa niskim zalihama |

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

| Layer | Test Type | Coverage Focus |
|-------|-----------|----------------|
| Services | Unit | Business logic, validacija, edge cases |
| Repositories | Unit/Integration | CRUD operacije, queries |
| Controllers | Integration | Request/Response handling |
| Middleware | Unit | Error handling, validation |

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

| Concern | Solution |
|---------|----------|
| Input Validation | Zod schemas na svim endpoints |
| SQL Injection | Parametrizovani queries (ORM) |
| Error Exposure | Generic error messages u production |
| Logging | Bez sensitive data u logovima |

---

## Scalability Notes

Trenutna arhitektura je dizajnirana za single-instance deployment sa SQLite. Za buduće skaliranje:

1. **Database Migration**: SQLite → PostgreSQL/MySQL
2. **Caching Layer**: Redis za frequently accessed data
3. **API Rate Limiting**: Express rate-limit middleware
4. **Horizontal Scaling**: Stateless design omogućava lako skaliranje

---

## Next Steps

1. [ ] **API.md** - Detaljna API dokumentacija sa primerima
2. [ ] **DATABASE.md** - Detaljna šema baze i migracije
3. [ ] **TESTING.md** - Test plan i strategija
4. [ ] **Setup projekta** - Inicijalizacija i konfiguracija

