# Architecture Document

## System Overview

Warehouse Inventory System is a **full-stack web application** designed following modern architectural principles. The system enables management of products, categories, and inventory with a complete audit trail of all changes.

The application consists of:

- **Frontend**: React-based SPA for user interaction
- **Backend**: Node.js REST API for business logic and data management
- **Database**: SQLite for persistent storage

---

## Full-Stack Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                        │
│                         (React SPA - Vite)                                  │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐    │
│  │    Pages    │  │ Components  │  │   Hooks     │  │  State (Zustand)│    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/REST (JSON)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND                                         │
│                      (Node.js + Express + TypeScript)                       │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      PRESENTATION LAYER                              │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────────┐  │   │
│  │  │ Controllers │  │  Middleware │  │  Error Handler (Global)     │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        BUSINESS LAYER                                │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │   │
│  │  │Product Svc  │  │Category Svc │  │Inventory Svc│  │Report Svc │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                       DATA ACCESS LAYER                              │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │   │
│  │  │Product Repo │  │Category Repo│  │Inventory Repo│ │Audit Repo │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE                                        │
│                              (SQLite)                                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend

| Layer         | Technology          | Reason                                      |
| ------------- | ------------------- | ------------------------------------------- |
| Framework     | **React 18**        | Component-based, large ecosystem            |
| Build Tool    | **Vite**            | Fast HMR, optimized builds                  |
| Language      | **TypeScript**      | Type safety, shared types with backend      |
| Styling       | **Tailwind CSS**    | Utility-first, rapid UI development         |
| State         | **Zustand**         | Lightweight, simple API                     |
| Data Fetching | **TanStack Query**  | Caching, background updates, loading states |
| Forms         | **React Hook Form** | Performance, validation integration         |
| Validation    | **Zod**             | Shared schemas with backend                 |
| Routing       | **React Router**    | Standard routing solution                   |
| HTTP Client   | **Axios**           | Interceptors, error handling                |
| Tables        | **TanStack Table**  | Sorting, filtering, pagination              |
| Notifications | **React Hot Toast** | User feedback                               |

### Backend

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

## Project Structure

```
warehouse-inventory-system/
│
├── frontend/                      # React Frontend Application
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Page components (routes)
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── services/              # API client services
│   │   ├── stores/                # Zustand state stores
│   │   ├── types/                 # TypeScript types
│   │   ├── utils/                 # Utility functions
│   │   ├── App.tsx                # Root component
│   │   └── main.tsx               # Entry point
│   ├── public/                    # Static assets
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── backend/                       # Node.js Backend Application
│   ├── src/
│   │   ├── controllers/           # Request handlers
│   │   ├── services/              # Business logic
│   │   ├── repositories/          # Data access
│   │   ├── models/                # Data models/entities
│   │   ├── middleware/            # Express middleware
│   │   ├── routes/                # Route definitions
│   │   ├── utils/                 # Utility functions
│   │   ├── config/                # Configuration
│   │   ├── types/                 # TypeScript types
│   │   └── app.ts                 # Application entry point
│   ├── tests/                     # Test files
│   ├── database/                  # Migrations and seeds
│   ├── logs/                      # Application logs
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
│
├── shared/                        # Shared code between FE and BE
│   └── types/                     # Shared TypeScript types
│       ├── product.types.ts
│       ├── category.types.ts
│       ├── inventory.types.ts
│       └── api.types.ts
│
├── docs/                          # Documentation
│   └── *.md
│
├── REQUIREMENTS.md
├── ARCHITECTURE.md
├── DATA-MODEL.md
├── FRONTEND-ARCHITECTURE.md
└── README.md
```

---

## Communication Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           USER INTERACTION                                │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  FRONTEND                                                                 │
│  ┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐   │
│  │   Page     │───▶│   Hook     │───▶│  Service   │───▶│   Store    │   │
│  │ Component  │    │(useQuery)  │    │ (API call) │    │ (Zustand)  │   │
│  └────────────┘    └────────────┘    └────────────┘    └────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                           HTTP Request (JSON)
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  BACKEND                                                                  │
│  ┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐   │
│  │   Route    │───▶│ Controller │───▶│  Service   │───▶│ Repository │   │
│  └────────────┘    └────────────┘    └────────────┘    └────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                              DATABASE                                     │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Backend Architecture

### Database Schema (ERD)

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

## Error Handling Strategy

### Backend Error Types

```typescript
// Custom Error Classes
├── AppError (base class)
│   ├── ValidationError (400)
│   ├── NotFoundError (404)
│   ├── ConflictError (409)
│   └── DatabaseError (500)
```

### API Error Response Format

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

### Frontend Error Handling

- **API Errors**: Caught by Axios interceptors, displayed via toast notifications
- **Form Errors**: Handled by React Hook Form + Zod validation
- **Global Errors**: Error boundary components catch React errors

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

### Backend Test Focus

| Layer        | Test Type        | Coverage Focus                         |
| ------------ | ---------------- | -------------------------------------- |
| Services     | Unit             | Business logic, validation, edge cases |
| Repositories | Unit/Integration | CRUD operations, queries               |
| Controllers  | Integration      | Request/Response handling              |
| Middleware   | Unit             | Error handling, validation             |

### Frontend Test Focus

| Layer      | Test Type   | Coverage Focus                 |
| ---------- | ----------- | ------------------------------ |
| Components | Unit        | Rendering, user interactions   |
| Hooks      | Unit        | State management, side effects |
| Services   | Unit        | API calls, data transformation |
| Pages      | Integration | Full page flows, routing       |

---

## Security Considerations

| Concern          | Solution                             |
| ---------------- | ------------------------------------ |
| Input Validation | Zod schemas on frontend and backend  |
| SQL Injection    | Parameterized queries (ORM)          |
| XSS              | React's built-in escaping            |
| Error Exposure   | Generic error messages in production |
| CORS             | Configured allowed origins           |

---

## Scalability Notes

Current architecture is designed for single-instance deployment. For future scaling:

1. **Database Migration**: SQLite → PostgreSQL/MySQL
2. **Caching Layer**: Redis for frequently accessed data
3. **API Rate Limiting**: Express rate-limit middleware
4. **Horizontal Scaling**: Stateless design enables easy scaling
5. **CDN**: Static frontend assets served via CDN
6. **Container**: Docker for consistent deployments

---

## Related Documentation

| Document                   | Description                                |
| -------------------------- | ------------------------------------------ |
| `REQUIREMENTS.md`          | Functional and non-functional requirements |
| `DATA-MODEL.md`            | Detailed database schema and types         |
| `FRONTEND-ARCHITECTURE.md` | Frontend-specific architecture details     |
| `API.md`                   | Detailed API documentation                 |
| `TESTING.md`               | Test plan and strategy                     |
