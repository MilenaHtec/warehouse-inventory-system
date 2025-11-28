# Implementation Tasks

## Overview

This document contains the complete task breakdown for implementing the Warehouse Inventory System. Tasks are organized by phase and priority.

**Legend:**

- 🔴 P0 - Critical (MVP blocker)
- 🟠 P1 - Important (MVP feature)
- 🟡 P2 - Nice to have
- ⬜ Not started
- 🔄 In progress
- ✅ Completed

---

## Table of Contents

1. [Phase 0: Project Setup](#phase-0-project-setup)
2. [Phase 1: Backend Core](#phase-1-backend-core)
3. [Phase 2: Backend Features](#phase-2-backend-features)
4. [Phase 3: Frontend Core](#phase-3-frontend-core)
5. [Phase 4: Frontend Features](#phase-4-frontend-features)
6. [Phase 5: Integration & Polish](#phase-5-integration--polish)
7. [Phase 6: Testing & QA](#phase-6-testing--qa)
8. [Phase 7: Documentation & Deployment](#phase-7-documentation--deployment)

---

## Phase 0: Project Setup

### 0.1 Repository & Configuration

| ID    | Task                                                              | Priority | Status | Notes |
| ----- | ----------------------------------------------------------------- | -------- | ------ | ----- |
| 0.1.1 | ⬜ Create monorepo structure (`frontend/`, `backend/`, `shared/`) | 🔴 P0    |        |       |
| 0.1.2 | ⬜ Initialize Git with `.gitignore`                               | 🔴 P0    |        |       |
| 0.1.3 | ⬜ Create `.env.example` files for both FE and BE                 | 🔴 P0    |        |       |
| 0.1.4 | ⬜ Setup EditorConfig for consistent formatting                   | 🟡 P2    |        |       |
| 0.1.5 | ⬜ Create README.md with setup instructions                       | 🟠 P1    |        |       |

### 0.2 Backend Setup

| ID     | Task                                                | Priority | Status | Notes |
| ------ | --------------------------------------------------- | -------- | ------ | ----- |
| 0.2.1  | ⬜ Initialize Node.js project (`npm init`)          | 🔴 P0    |        |       |
| 0.2.2  | ⬜ Install TypeScript and configure `tsconfig.json` | 🔴 P0    |        |       |
| 0.2.3  | ⬜ Install Express.js                               | 🔴 P0    |        |       |
| 0.2.4  | ⬜ Install better-sqlite3                           | 🔴 P0    |        |       |
| 0.2.5  | ⬜ Install Zod for validation                       | 🔴 P0    |        |       |
| 0.2.6  | ⬜ Install Winston for logging                      | 🟠 P1    |        |       |
| 0.2.7  | ⬜ Install Jest and ts-jest for testing             | 🟠 P1    |        |       |
| 0.2.8  | ⬜ Install dev dependencies (nodemon, ts-node)      | 🔴 P0    |        |       |
| 0.2.9  | ⬜ Configure ESLint + Prettier                      | 🟠 P1    |        |       |
| 0.2.10 | ⬜ Setup npm scripts (dev, build, test, lint)       | 🔴 P0    |        |       |

### 0.3 Frontend Setup

| ID     | Task                                                     | Priority | Status | Notes |
| ------ | -------------------------------------------------------- | -------- | ------ | ----- |
| 0.3.1  | ⬜ Create Vite + React + TypeScript project              | 🔴 P0    |        |       |
| 0.3.2  | ⬜ Install and configure Tailwind CSS                    | 🔴 P0    |        |       |
| 0.3.3  | ⬜ Install TanStack Query                                | 🔴 P0    |        |       |
| 0.3.4  | ⬜ Install Zustand                                       | 🔴 P0    |        |       |
| 0.3.5  | ⬜ Install React Router                                  | 🔴 P0    |        |       |
| 0.3.6  | ⬜ Install React Hook Form + Zod resolver                | 🔴 P0    |        |       |
| 0.3.7  | ⬜ Install Axios                                         | 🔴 P0    |        |       |
| 0.3.8  | ⬜ Install TanStack Table                                | 🟠 P1    |        |       |
| 0.3.9  | ⬜ Install Lucide React icons                            | 🟠 P1    |        |       |
| 0.3.10 | ⬜ Install React Hot Toast                               | 🟠 P1    |        |       |
| 0.3.11 | ⬜ Configure path aliases (`@/`)                         | 🔴 P0    |        |       |
| 0.3.12 | ⬜ Setup Tailwind config with custom theme (STYLE-GUIDE) | 🔴 P0    |        |       |
| 0.3.13 | ⬜ Create global CSS with CSS variables                  | 🔴 P0    |        |       |
| 0.3.14 | ⬜ Configure ESLint + Prettier                           | 🟠 P1    |        |       |
| 0.3.15 | ⬜ Install Vitest for testing                            | 🟠 P1    |        |       |

### 0.4 Shared Types Setup

| ID    | Task                                             | Priority | Status | Notes |
| ----- | ------------------------------------------------ | -------- | ------ | ----- |
| 0.4.1 | ⬜ Create `shared/types/` directory              | 🔴 P0    |        |       |
| 0.4.2 | ⬜ Define Product types and DTOs                 | 🔴 P0    |        |       |
| 0.4.3 | ⬜ Define Category types and DTOs                | 🔴 P0    |        |       |
| 0.4.4 | ⬜ Define Inventory types and DTOs               | 🔴 P0    |        |       |
| 0.4.5 | ⬜ Define API response types                     | 🔴 P0    |        |       |
| 0.4.6 | ⬜ Configure TypeScript paths for shared imports | 🔴 P0    |        |       |

---

## Phase 1: Backend Core

### 1.1 Database Layer

| ID     | Task                                                        | Priority | Status | Notes |
| ------ | ----------------------------------------------------------- | -------- | ------ | ----- |
| 1.1.1  | ⬜ Create database configuration (`src/config/database.ts`) | 🔴 P0    |        |       |
| 1.1.2  | ⬜ Create database connection utility                       | 🔴 P0    |        |       |
| 1.1.3  | ⬜ Create migration system/runner                           | 🔴 P0    |        |       |
| 1.1.4  | ⬜ Write initial migration (001_initial_schema.sql)         | 🔴 P0    |        |       |
| 1.1.5  | ⬜ Create categories table                                  | 🔴 P0    |        |       |
| 1.1.6  | ⬜ Create products table with FK to categories              | 🔴 P0    |        |       |
| 1.1.7  | ⬜ Create inventory_history table with FK to products       | 🔴 P0    |        |       |
| 1.1.8  | ⬜ Create database indexes                                  | 🟠 P1    |        |       |
| 1.1.9  | ⬜ Create seed data script                                  | 🟠 P1    |        |       |
| 1.1.10 | ⬜ Test database setup and migrations                       | 🔴 P0    |        |       |

### 1.2 Core Infrastructure

| ID    | Task                                             | Priority | Status | Notes |
| ----- | ------------------------------------------------ | -------- | ------ | ----- |
| 1.2.1 | ⬜ Create Express app entry point (`src/app.ts`) | 🔴 P0    |        |       |
| 1.2.2 | ⬜ Setup CORS middleware                         | 🔴 P0    |        |       |
| 1.2.3 | ⬜ Setup JSON body parser                        | 🔴 P0    |        |       |
| 1.2.4 | ⬜ Create logger utility with Winston            | 🟠 P1    |        |       |
| 1.2.5 | ⬜ Create request logger middleware              | 🟠 P1    |        |       |
| 1.2.6 | ⬜ Create request ID middleware                  | 🟠 P1    |        |       |

### 1.3 Error Handling

| ID     | Task                                              | Priority | Status | Notes |
| ------ | ------------------------------------------------- | -------- | ------ | ----- |
| 1.3.1  | ⬜ Create base AppError class                     | 🔴 P0    |        |       |
| 1.3.2  | ⬜ Create ValidationError class                   | 🔴 P0    |        |       |
| 1.3.3  | ⬜ Create NotFoundError class                     | 🔴 P0    |        |       |
| 1.3.4  | ⬜ Create ConflictError class                     | 🔴 P0    |        |       |
| 1.3.5  | ⬜ Create BusinessError class                     | 🔴 P0    |        |       |
| 1.3.6  | ⬜ Create DatabaseError class                     | 🔴 P0    |        |       |
| 1.3.7  | ⬜ Create error factory functions (Errors object) | 🔴 P0    |        |       |
| 1.3.8  | ⬜ Create global error handler middleware         | 🔴 P0    |        |       |
| 1.3.9  | ⬜ Create async handler wrapper                   | 🔴 P0    |        |       |
| 1.3.10 | ⬜ Test error handling                            | 🔴 P0    |        |       |

### 1.4 Validation Layer

| ID    | Task                                                   | Priority | Status | Notes |
| ----- | ------------------------------------------------------ | -------- | ------ | ----- |
| 1.4.1 | ⬜ Create validation middleware factory                | 🔴 P0    |        |       |
| 1.4.2 | ⬜ Create product validation schemas                   | 🔴 P0    |        |       |
| 1.4.3 | ⬜ Create category validation schemas                  | 🔴 P0    |        |       |
| 1.4.4 | ⬜ Create inventory validation schemas                 | 🔴 P0    |        |       |
| 1.4.5 | ⬜ Create common validation schemas (pagination, etc.) | 🔴 P0    |        |       |

---

## Phase 2: Backend Features

### 2.1 Category Module

| ID             | Task                                                | Priority | Status | Notes |
| -------------- | --------------------------------------------------- | -------- | ------ | ----- |
| **Repository** |
| 2.1.1          | ⬜ Create CategoryRepository class                  | 🔴 P0    |        |       |
| 2.1.2          | ⬜ Implement `findAll()`                            | 🔴 P0    |        |       |
| 2.1.3          | ⬜ Implement `findById(id)`                         | 🔴 P0    |        |       |
| 2.1.4          | ⬜ Implement `findByName(name)`                     | 🔴 P0    |        |       |
| 2.1.5          | ⬜ Implement `create(data)`                         | 🔴 P0    |        |       |
| 2.1.6          | ⬜ Implement `update(id, data)`                     | 🔴 P0    |        |       |
| 2.1.7          | ⬜ Implement `delete(id)`                           | 🔴 P0    |        |       |
| 2.1.8          | ⬜ Implement `getProductCount(id)`                  | 🟠 P1    |        |       |
| **Service**    |
| 2.1.9          | ⬜ Create CategoryService class                     | 🔴 P0    |        |       |
| 2.1.10         | ⬜ Implement `getAll()` with product counts         | 🔴 P0    |        |       |
| 2.1.11         | ⬜ Implement `getById(id)`                          | 🔴 P0    |        |       |
| 2.1.12         | ⬜ Implement `create(data)` with uniqueness check   | 🔴 P0    |        |       |
| 2.1.13         | ⬜ Implement `update(id, data)`                     | 🔴 P0    |        |       |
| 2.1.14         | ⬜ Implement `delete(id)` with product check        | 🔴 P0    |        |       |
| **Controller** |
| 2.1.15         | ⬜ Create CategoryController class                  | 🔴 P0    |        |       |
| 2.1.16         | ⬜ Implement GET `/categories` handler              | 🔴 P0    |        |       |
| 2.1.17         | ⬜ Implement GET `/categories/:id` handler          | 🔴 P0    |        |       |
| 2.1.18         | ⬜ Implement POST `/categories` handler             | 🔴 P0    |        |       |
| 2.1.19         | ⬜ Implement PUT `/categories/:id` handler          | 🔴 P0    |        |       |
| 2.1.20         | ⬜ Implement DELETE `/categories/:id` handler       | 🔴 P0    |        |       |
| 2.1.21         | ⬜ Implement GET `/categories/:id/products` handler | 🟠 P1    |        |       |
| **Routes**     |
| 2.1.22         | ⬜ Create category routes file                      | 🔴 P0    |        |       |
| 2.1.23         | ⬜ Register routes in app                           | 🔴 P0    |        |       |
| **Tests**      |
| 2.1.24         | ⬜ Write CategoryRepository unit tests              | 🟠 P1    |        |       |
| 2.1.25         | ⬜ Write CategoryService unit tests                 | 🟠 P1    |        |       |
| 2.1.26         | ⬜ Write Category API integration tests             | 🟠 P1    |        |       |

### 2.2 Product Module

| ID             | Task                                            | Priority | Status | Notes |
| -------------- | ----------------------------------------------- | -------- | ------ | ----- |
| **Repository** |
| 2.2.1          | ⬜ Create ProductRepository class               | 🔴 P0    |        |       |
| 2.2.2          | ⬜ Implement `findAll(filters)` with pagination | 🔴 P0    |        |       |
| 2.2.3          | ⬜ Implement `findById(id)` with category       | 🔴 P0    |        |       |
| 2.2.4          | ⬜ Implement `findByCode(code)`                 | 🔴 P0    |        |       |
| 2.2.5          | ⬜ Implement `create(data)`                     | 🔴 P0    |        |       |
| 2.2.6          | ⬜ Implement `update(id, data)`                 | 🔴 P0    |        |       |
| 2.2.7          | ⬜ Implement `delete(id)`                       | 🔴 P0    |        |       |
| 2.2.8          | ⬜ Implement `updateQuantity(id, quantity)`     | 🔴 P0    |        |       |
| 2.2.9          | ⬜ Implement `search(query)`                    | 🔴 P0    |        |       |
| 2.2.10         | ⬜ Implement `count(filters)` for pagination    | 🔴 P0    |        |       |
| **Service**    |
| 2.2.11         | ⬜ Create ProductService class                  | 🔴 P0    |        |       |
| 2.2.12         | ⬜ Implement `getAll(filters)`                  | 🔴 P0    |        |       |
| 2.2.13         | ⬜ Implement `getById(id)`                      | 🔴 P0    |        |       |
| 2.2.14         | ⬜ Implement `create(data)` with validations    | 🔴 P0    |        |       |
| 2.2.15         | ⬜ Implement `update(id, data)`                 | 🔴 P0    |        |       |
| 2.2.16         | ⬜ Implement `delete(id)`                       | 🔴 P0    |        |       |
| 2.2.17         | ⬜ Implement `search(query)`                    | 🔴 P0    |        |       |
| **Controller** |
| 2.2.18         | ⬜ Create ProductController class               | 🔴 P0    |        |       |
| 2.2.19         | ⬜ Implement GET `/products` handler            | 🔴 P0    |        |       |
| 2.2.20         | ⬜ Implement GET `/products/:id` handler        | 🔴 P0    |        |       |
| 2.2.21         | ⬜ Implement GET `/products/search` handler     | 🔴 P0    |        |       |
| 2.2.22         | ⬜ Implement POST `/products` handler           | 🔴 P0    |        |       |
| 2.2.23         | ⬜ Implement PUT `/products/:id` handler        | 🔴 P0    |        |       |
| 2.2.24         | ⬜ Implement DELETE `/products/:id` handler     | 🔴 P0    |        |       |
| **Routes**     |
| 2.2.25         | ⬜ Create product routes file                   | 🔴 P0    |        |       |
| 2.2.26         | ⬜ Register routes in app                       | 🔴 P0    |        |       |
| **Tests**      |
| 2.2.27         | ⬜ Write ProductRepository unit tests           | 🟠 P1    |        |       |
| 2.2.28         | ⬜ Write ProductService unit tests              | 🟠 P1    |        |       |
| 2.2.29         | ⬜ Write Product API integration tests          | 🟠 P1    |        |       |

### 2.3 Inventory Module

| ID             | Task                                                  | Priority | Status | Notes     |
| -------------- | ----------------------------------------------------- | -------- | ------ | --------- |
| **Repository** |
| 2.3.1          | ⬜ Create InventoryRepository (AuditRepository)       | 🔴 P0    |        |           |
| 2.3.2          | ⬜ Implement `logChange(data)`                        | 🔴 P0    |        |           |
| 2.3.3          | ⬜ Implement `findByProductId(productId, filters)`    | 🔴 P0    |        |           |
| 2.3.4          | ⬜ Implement `findAll(filters)` with pagination       | 🔴 P0    |        |           |
| **Service**    |
| 2.3.5          | ⬜ Create InventoryService class                      | 🔴 P0    |        |           |
| 2.3.6          | ⬜ Implement `increaseStock(productId, qty, reason)`  | 🔴 P0    |        |           |
| 2.3.7          | ⬜ Implement `decreaseStock(productId, qty, reason)`  | 🔴 P0    |        |           |
| 2.3.8          | ⬜ Implement `adjustStock(productId, newQty, reason)` | 🟠 P1    |        |           |
| 2.3.9          | ⬜ Implement `getHistory(productId, filters)`         | 🔴 P0    |        |           |
| 2.3.10         | ⬜ Add stock validation (prevent negative)            | 🔴 P0    |        |           |
| 2.3.11         | ⬜ Use transactions for stock + history               | 🔴 P0    |        |           |
| **Controller** |
| 2.3.12         | ⬜ Create InventoryController class                   | 🔴 P0    |        |           |
| 2.3.13         | ⬜ Implement POST `/inventory/:productId/increase`    | 🔴 P0    |        |           |
| 2.3.14         | ⬜ Implement POST `/inventory/:productId/decrease`    | 🔴 P0    |        |           |
| 2.3.15         | ⬜ Implement POST `/inventory/:productId/adjust`      | 🟠 P1    |        |           |
| 2.3.16         | ⬜ Implement GET `/inventory/:productId/history`      | 🔴 P0    |        |           |
| **Routes**     |
| 2.3.17         | ⬜ Create inventory routes file                       | 🔴 P0    |        |           |
| 2.3.18         | ⬜ Register routes in app                             | 🔴 P0    |        |           |
| **Tests**      |
| 2.3.19         | ⬜ Write InventoryService unit tests                  | 🔴 P0    |        | Critical! |
| 2.3.20         | ⬜ Test stock decrease validation                     | 🔴 P0    |        |           |
| 2.3.21         | ⬜ Test transaction rollback                          | 🟠 P1    |        |           |
| 2.3.22         | ⬜ Write Inventory API integration tests              | 🟠 P1    |        |           |

### 2.4 Reports Module

| ID             | Task                                          | Priority | Status | Notes |
| -------------- | --------------------------------------------- | -------- | ------ | ----- |
| **Repository** |
| 2.4.1          | ⬜ Create ReportRepository class              | 🟠 P1    |        |       |
| 2.4.2          | ⬜ Implement `getStockByCategory()` query     | 🟠 P1    |        |       |
| 2.4.3          | ⬜ Implement `getLowStockProducts(threshold)` | 🟠 P1    |        |       |
| **Service**    |
| 2.4.4          | ⬜ Create ReportService class                 | 🟠 P1    |        |       |
| 2.4.5          | ⬜ Implement `getStockByCategory()`           | 🟠 P1    |        |       |
| 2.4.6          | ⬜ Implement `getInventoryHistory(filters)`   | 🟠 P1    |        |       |
| 2.4.7          | ⬜ Implement `getLowStock(threshold)`         | 🟠 P1    |        |       |
| **Controller** |
| 2.4.8          | ⬜ Create ReportController class              | 🟠 P1    |        |       |
| 2.4.9          | ⬜ Implement GET `/reports/stock-by-category` | 🟠 P1    |        |       |
| 2.4.10         | ⬜ Implement GET `/reports/inventory-history` | 🟠 P1    |        |       |
| 2.4.11         | ⬜ Implement GET `/reports/low-stock`         | 🟠 P1    |        |       |
| **Routes**     |
| 2.4.12         | ⬜ Create report routes file                  | 🟠 P1    |        |       |
| 2.4.13         | ⬜ Register routes in app                     | 🟠 P1    |        |       |

### 2.5 Health Check

| ID    | Task                                 | Priority | Status | Notes |
| ----- | ------------------------------------ | -------- | ------ | ----- |
| 2.5.1 | ⬜ Create GET `/api/health` endpoint | 🟠 P1    |        |       |
| 2.5.2 | ⬜ Include DB connection status      | 🟠 P1    |        |       |
| 2.5.3 | ⬜ Include version and uptime        | 🟡 P2    |        |       |

---

## Phase 3: Frontend Core

### 3.1 Base UI Components

| ID     | Task                                               | Priority | Status | Notes |
| ------ | -------------------------------------------------- | -------- | ------ | ----- |
| 3.1.1  | ⬜ Create `cn()` utility for classnames            | 🔴 P0    |        |       |
| 3.1.2  | ⬜ Create Button component (variants, sizes)       | 🔴 P0    |        |       |
| 3.1.3  | ⬜ Create Input component (with label, error)      | 🔴 P0    |        |       |
| 3.1.4  | ⬜ Create Select component                         | 🔴 P0    |        |       |
| 3.1.5  | ⬜ Create Checkbox component                       | 🟠 P1    |        |       |
| 3.1.6  | ⬜ Create Card component                           | 🔴 P0    |        |       |
| 3.1.7  | ⬜ Create Badge component (variants)               | 🔴 P0    |        |       |
| 3.1.8  | ⬜ Create Modal component                          | 🔴 P0    |        |       |
| 3.1.9  | ⬜ Create Spinner/Loading component                | 🔴 P0    |        |       |
| 3.1.10 | ⬜ Create Skeleton component                       | 🟠 P1    |        |       |
| 3.1.11 | ⬜ Create ConfirmDialog component                  | 🔴 P0    |        |       |
| 3.1.12 | ⬜ Create EmptyState component                     | 🟠 P1    |        |       |
| 3.1.13 | ⬜ Create ErrorState component                     | 🟠 P1    |        |       |
| 3.1.14 | ⬜ Create component barrel exports (`ui/index.ts`) | 🔴 P0    |        |       |

### 3.2 Layout Components

| ID    | Task                                     | Priority | Status | Notes |
| ----- | ---------------------------------------- | -------- | ------ | ----- |
| 3.2.1 | ⬜ Create MainLayout component           | 🔴 P0    |        |       |
| 3.2.2 | ⬜ Create Header component               | 🔴 P0    |        |       |
| 3.2.3 | ⬜ Create Sidebar component              | 🔴 P0    |        |       |
| 3.2.4 | ⬜ Create SidebarItem component          | 🔴 P0    |        |       |
| 3.2.5 | ⬜ Create PageHeader component           | 🔴 P0    |        |       |
| 3.2.6 | ⬜ Implement sidebar collapse/expand     | 🟠 P1    |        |       |
| 3.2.7 | ⬜ Implement responsive sidebar (mobile) | 🟠 P1    |        |       |

### 3.3 Core Infrastructure

| ID    | Task                                           | Priority | Status | Notes |
| ----- | ---------------------------------------------- | -------- | ------ | ----- |
| 3.3.1 | ⬜ Setup API client (Axios instance)           | 🔴 P0    |        |       |
| 3.3.2 | ⬜ Configure response interceptor              | 🔴 P0    |        |       |
| 3.3.3 | ⬜ Configure error interceptor                 | 🔴 P0    |        |       |
| 3.3.4 | ⬜ Setup TanStack Query provider               | 🔴 P0    |        |       |
| 3.3.5 | ⬜ Configure query defaults (stale time, etc.) | 🔴 P0    |        |       |
| 3.3.6 | ⬜ Setup Toast provider                        | 🔴 P0    |        |       |
| 3.3.7 | ⬜ Create ErrorBoundary component              | 🟠 P1    |        |       |
| 3.3.8 | ⬜ Setup React Router with routes              | 🔴 P0    |        |       |

### 3.4 State Management

| ID    | Task                                       | Priority | Status | Notes |
| ----- | ------------------------------------------ | -------- | ------ | ----- |
| 3.4.1 | ⬜ Create useUIStore (sidebar, modals)     | 🔴 P0    |        |       |
| 3.4.2 | ⬜ Create useFilterStore (product filters) | 🟠 P1    |        |       |

### 3.5 Custom Hooks

| ID    | Task                           | Priority | Status | Notes |
| ----- | ------------------------------ | -------- | ------ | ----- |
| 3.5.1 | ⬜ Create useDebounce hook     | 🔴 P0    |        |       |
| 3.5.2 | ⬜ Create useConfirm hook      | 🟠 P1    |        |       |
| 3.5.3 | ⬜ Create useLocalStorage hook | 🟡 P2    |        |       |

### 3.6 Utilities

| ID    | Task                                 | Priority | Status | Notes |
| ----- | ------------------------------------ | -------- | ------ | ----- |
| 3.6.1 | ⬜ Create formatCurrency utility     | 🔴 P0    |        |       |
| 3.6.2 | ⬜ Create formatDate utility         | 🔴 P0    |        |       |
| 3.6.3 | ⬜ Create formatRelativeTime utility | 🟠 P1    |        |       |

---

## Phase 4: Frontend Features

### 4.1 Category Feature

| ID              | Task                                 | Priority | Status | Notes    |
| --------------- | ------------------------------------ | -------- | ------ | -------- |
| **API Service** |
| 4.1.1           | ⬜ Create categories.service.ts      | 🔴 P0    |        |          |
| 4.1.2           | ⬜ Implement getAll()                | 🔴 P0    |        |          |
| 4.1.3           | ⬜ Implement getById()               | 🔴 P0    |        |          |
| 4.1.4           | ⬜ Implement create()                | 🔴 P0    |        |          |
| 4.1.5           | ⬜ Implement update()                | 🔴 P0    |        |          |
| 4.1.6           | ⬜ Implement delete()                | 🔴 P0    |        |          |
| **Hooks**       |
| 4.1.7           | ⬜ Create useCategories hook         | 🔴 P0    |        |          |
| 4.1.8           | ⬜ Create useCategory hook           | 🔴 P0    |        |          |
| 4.1.9           | ⬜ Create useCreateCategory mutation | 🔴 P0    |        |          |
| 4.1.10          | ⬜ Create useUpdateCategory mutation | 🔴 P0    |        |          |
| 4.1.11          | ⬜ Create useDeleteCategory mutation | 🔴 P0    |        |          |
| **Components**  |
| 4.1.12          | ⬜ Create CategoryForm component     | 🔴 P0    |        |          |
| 4.1.13          | ⬜ Create CategoriesTable component  | 🔴 P0    |        |          |
| 4.1.14          | ⬜ Create CategorySelect component   | 🔴 P0    |        | Reusable |
| **Pages**       |
| 4.1.15          | ⬜ Create CategoryList page          | 🔴 P0    |        |          |
| 4.1.16          | ⬜ Add create category modal         | 🔴 P0    |        |          |
| 4.1.17          | ⬜ Add edit category modal           | 🔴 P0    |        |          |
| 4.1.18          | ⬜ Add delete confirmation           | 🔴 P0    |        |          |
| 4.1.19          | ⬜ Create CategoryDetail page        | 🟠 P1    |        |          |

### 4.2 Product Feature

| ID              | Task                                | Priority | Status | Notes       |
| --------------- | ----------------------------------- | -------- | ------ | ----------- |
| **API Service** |
| 4.2.1           | ⬜ Create products.service.ts       | 🔴 P0    |        |             |
| 4.2.2           | ⬜ Implement getAll(filters)        | 🔴 P0    |        |             |
| 4.2.3           | ⬜ Implement getById()              | 🔴 P0    |        |             |
| 4.2.4           | ⬜ Implement search()               | 🔴 P0    |        |             |
| 4.2.5           | ⬜ Implement create()               | 🔴 P0    |        |             |
| 4.2.6           | ⬜ Implement update()               | 🔴 P0    |        |             |
| 4.2.7           | ⬜ Implement delete()               | 🔴 P0    |        |             |
| **Hooks**       |
| 4.2.8           | ⬜ Create useProducts hook          | 🔴 P0    |        |             |
| 4.2.9           | ⬜ Create useProduct hook           | 🔴 P0    |        |             |
| 4.2.10          | ⬜ Create useProductSearch hook     | 🔴 P0    |        |             |
| 4.2.11          | ⬜ Create useCreateProduct mutation | 🔴 P0    |        |             |
| 4.2.12          | ⬜ Create useUpdateProduct mutation | 🔴 P0    |        |             |
| 4.2.13          | ⬜ Create useDeleteProduct mutation | 🔴 P0    |        |             |
| **Components**  |
| 4.2.14          | ⬜ Create ProductForm component     | 🔴 P0    |        |             |
| 4.2.15          | ⬜ Create ProductsTable component   | 🔴 P0    |        |             |
| 4.2.16          | ⬜ Create ProductFilters component  | 🟠 P1    |        |             |
| 4.2.17          | ⬜ Create SearchInput component     | 🔴 P0    |        |             |
| 4.2.18          | ⬜ Create ProductCard component     | 🟠 P1    |        | Mobile view |
| **Pages**       |
| 4.2.19          | ⬜ Create ProductList page          | 🔴 P0    |        |             |
| 4.2.20          | ⬜ Implement pagination             | 🔴 P0    |        |             |
| 4.2.21          | ⬜ Implement sorting                | 🔴 P0    |        |             |
| 4.2.22          | ⬜ Implement filtering              | 🟠 P1    |        |             |
| 4.2.23          | ⬜ Implement search                 | 🔴 P0    |        |             |
| 4.2.24          | ⬜ Create ProductCreate page/modal  | 🔴 P0    |        |             |
| 4.2.25          | ⬜ Create ProductDetail page        | 🔴 P0    |        |             |
| 4.2.26          | ⬜ Add edit functionality           | 🔴 P0    |        |             |
| 4.2.27          | ⬜ Add delete confirmation          | 🔴 P0    |        |             |

### 4.3 Inventory Feature

| ID              | Task                                      | Priority | Status | Notes               |
| --------------- | ----------------------------------------- | -------- | ------ | ------------------- |
| **API Service** |
| 4.3.1           | ⬜ Create inventory.service.ts            | 🔴 P0    |        |                     |
| 4.3.2           | ⬜ Implement increaseStock()              | 🔴 P0    |        |                     |
| 4.3.3           | ⬜ Implement decreaseStock()              | 🔴 P0    |        |                     |
| 4.3.4           | ⬜ Implement adjustStock()                | 🟠 P1    |        |                     |
| 4.3.5           | ⬜ Implement getHistory()                 | 🔴 P0    |        |                     |
| **Hooks**       |
| 4.3.6           | ⬜ Create useIncreaseStock mutation       | 🔴 P0    |        |                     |
| 4.3.7           | ⬜ Create useDecreaseStock mutation       | 🔴 P0    |        |                     |
| 4.3.8           | ⬜ Create useAdjustStock mutation         | 🟠 P1    |        |                     |
| 4.3.9           | ⬜ Create useInventoryHistory hook        | 🔴 P0    |        |                     |
| **Components**  |
| 4.3.10          | ⬜ Create StockChangeForm component       | 🔴 P0    |        |                     |
| 4.3.11          | ⬜ Create ProductSearchSelect component   | 🔴 P0    |        |                     |
| 4.3.12          | ⬜ Create InventoryHistoryTable component | 🔴 P0    |        |                     |
| 4.3.13          | ⬜ Create StockBadge component            | 🟠 P1    |        | Low stock indicator |
| **Pages**       |
| 4.3.14          | ⬜ Create StockManagement page            | 🔴 P0    |        |                     |
| 4.3.15          | ⬜ Implement increase stock flow          | 🔴 P0    |        |                     |
| 4.3.16          | ⬜ Implement decrease stock flow          | 🔴 P0    |        |                     |
| 4.3.17          | ⬜ Show before/after quantities           | 🔴 P0    |        |                     |
| 4.3.18          | ⬜ Handle insufficient stock error        | 🔴 P0    |        |                     |
| 4.3.19          | ⬜ Create InventoryHistory page           | 🔴 P0    |        |                     |
| 4.3.20          | ⬜ Implement history filters              | 🟠 P1    |        |                     |

### 4.4 Reports Feature

| ID              | Task                                     | Priority | Status | Notes |
| --------------- | ---------------------------------------- | -------- | ------ | ----- |
| **API Service** |
| 4.4.1           | ⬜ Create reports.service.ts             | 🟠 P1    |        |       |
| 4.4.2           | ⬜ Implement getStockByCategory()        | 🟠 P1    |        |       |
| 4.4.3           | ⬜ Implement getLowStock()               | 🟠 P1    |        |       |
| **Hooks**       |
| 4.4.4           | ⬜ Create useStockByCategory hook        | 🟠 P1    |        |       |
| 4.4.5           | ⬜ Create useLowStock hook               | 🟠 P1    |        |       |
| **Components**  |
| 4.4.6           | ⬜ Create StockByCategoryChart component | 🟠 P1    |        |       |
| 4.4.7           | ⬜ Create LowStockTable component        | 🟠 P1    |        |       |
| **Pages**       |
| 4.4.8           | ⬜ Create StockByCategory report page    | 🟠 P1    |        |       |
| 4.4.9           | ⬜ Create LowStockReport page            | 🟠 P1    |        |       |

### 4.5 Dashboard Feature

| ID             | Task                                       | Priority | Status | Notes |
| -------------- | ------------------------------------------ | -------- | ------ | ----- |
| **API/Hooks**  |
| 4.5.1          | ⬜ Create useDashboardStats hook           | 🟠 P1    |        |       |
| **Components** |
| 4.5.2          | ⬜ Create StatCard component               | 🟠 P1    |        |       |
| 4.5.3          | ⬜ Create RecentActivity component         | 🟠 P1    |        |       |
| 4.5.4          | ⬜ Create StockDistributionChart component | 🟡 P2    |        |       |
| **Pages**      |
| 4.5.5          | ⬜ Create Dashboard page                   | 🟠 P1    |        |       |
| 4.5.6          | ⬜ Display total products stat             | 🟠 P1    |        |       |
| 4.5.7          | ⬜ Display total categories stat           | 🟠 P1    |        |       |
| 4.5.8          | ⬜ Display low stock alert count           | 🟠 P1    |        |       |
| 4.5.9          | ⬜ Display recent activity feed            | 🟠 P1    |        |       |

### 4.6 Not Found Page

| ID    | Task                          | Priority | Status | Notes |
| ----- | ----------------------------- | -------- | ------ | ----- |
| 4.6.1 | ⬜ Create NotFound (404) page | 🟠 P1    |        |       |

---

## Phase 5: Integration & Polish

### 5.1 Integration Testing

| ID    | Task                                              | Priority | Status | Notes |
| ----- | ------------------------------------------------- | -------- | ------ | ----- |
| 5.1.1 | ⬜ Test complete product CRUD flow                | 🔴 P0    |        |       |
| 5.1.2 | ⬜ Test complete category CRUD flow               | 🔴 P0    |        |       |
| 5.1.3 | ⬜ Test stock increase flow                       | 🔴 P0    |        |       |
| 5.1.4 | ⬜ Test stock decrease flow (success)             | 🔴 P0    |        |       |
| 5.1.5 | ⬜ Test stock decrease flow (fail - insufficient) | 🔴 P0    |        |       |
| 5.1.6 | ⬜ Test search functionality                      | 🔴 P0    |        |       |
| 5.1.7 | ⬜ Test pagination                                | 🔴 P0    |        |       |
| 5.1.8 | ⬜ Test filtering                                 | 🟠 P1    |        |       |
| 5.1.9 | ⬜ Test category deletion with products           | 🔴 P0    |        |       |

### 5.2 UI Polish

| ID    | Task                                 | Priority | Status | Notes |
| ----- | ------------------------------------ | -------- | ------ | ----- |
| 5.2.1 | ⬜ Review all loading states         | 🟠 P1    |        |       |
| 5.2.2 | ⬜ Review all error states           | 🟠 P1    |        |       |
| 5.2.3 | ⬜ Review all empty states           | 🟠 P1    |        |       |
| 5.2.4 | ⬜ Review all toast messages         | 🟠 P1    |        |       |
| 5.2.5 | ⬜ Review keyboard navigation        | 🟡 P2    |        |       |
| 5.2.6 | ⬜ Review responsive design (tablet) | 🟠 P1    |        |       |
| 5.2.7 | ⬜ Fix any style inconsistencies     | 🟠 P1    |        |       |

### 5.3 Performance

| ID    | Task                               | Priority | Status | Notes |
| ----- | ---------------------------------- | -------- | ------ | ----- |
| 5.3.1 | ⬜ Verify API response times       | 🟠 P1    |        |       |
| 5.3.2 | ⬜ Add database indexes if missing | 🟠 P1    |        |       |
| 5.3.3 | ⬜ Optimize bundle size            | 🟡 P2    |        |       |
| 5.3.4 | ⬜ Add lazy loading for routes     | 🟡 P2    |        |       |

---

## Phase 6: Testing & QA

### 6.1 Backend Unit Tests

| ID    | Task                      | Priority | Status | Notes    |
| ----- | ------------------------- | -------- | ------ | -------- |
| 6.1.1 | ⬜ CategoryService tests  | 🟠 P1    |        |          |
| 6.1.2 | ⬜ ProductService tests   | 🟠 P1    |        |          |
| 6.1.3 | ⬜ InventoryService tests | 🔴 P0    |        | Critical |
| 6.1.4 | ⬜ ReportService tests    | 🟠 P1    |        |          |
| 6.1.5 | ⬜ Error handling tests   | 🟠 P1    |        |          |
| 6.1.6 | ⬜ Validation tests       | 🟠 P1    |        |          |

### 6.2 Backend Integration Tests

| ID    | Task                   | Priority | Status | Notes |
| ----- | ---------------------- | -------- | ------ | ----- |
| 6.2.1 | ⬜ Category API tests  | 🟠 P1    |        |       |
| 6.2.2 | ⬜ Product API tests   | 🟠 P1    |        |       |
| 6.2.3 | ⬜ Inventory API tests | 🟠 P1    |        |       |
| 6.2.4 | ⬜ Report API tests    | 🟠 P1    |        |       |

### 6.3 Frontend Tests

| ID    | Task                         | Priority | Status | Notes |
| ----- | ---------------------------- | -------- | ------ | ----- |
| 6.3.1 | ⬜ UI component tests        | 🟠 P1    |        |       |
| 6.3.2 | ⬜ Form component tests      | 🟠 P1    |        |       |
| 6.3.3 | ⬜ Hook tests                | 🟠 P1    |        |       |
| 6.3.4 | ⬜ Setup MSW for API mocking | 🟠 P1    |        |       |

### 6.4 Coverage Check

| ID    | Task                                 | Priority | Status | Notes |
| ----- | ------------------------------------ | -------- | ------ | ----- |
| 6.4.1 | ⬜ Generate backend coverage report  | 🟠 P1    |        |       |
| 6.4.2 | ⬜ Verify 70% coverage backend       | 🟠 P1    |        |       |
| 6.4.3 | ⬜ Generate frontend coverage report | 🟠 P1    |        |       |
| 6.4.4 | ⬜ Verify 70% coverage frontend      | 🟠 P1    |        |       |
| 6.4.5 | ⬜ Add missing tests if under 70%    | 🟠 P1    |        |       |

---

## Phase 7: Documentation & Deployment

### 7.1 Documentation

| ID    | Task                                       | Priority | Status | Notes |
| ----- | ------------------------------------------ | -------- | ------ | ----- |
| 7.1.1 | ⬜ Write README.md with setup instructions | 🔴 P0    |        |       |
| 7.1.2 | ⬜ Document environment variables          | 🔴 P0    |        |       |
| 7.1.3 | ⬜ Document npm scripts                    | 🟠 P1    |        |       |
| 7.1.4 | ⬜ Add code comments where needed          | 🟠 P1    |        |       |
| 7.1.5 | ⬜ Update all .md files if needed          | 🟠 P1    |        |       |

### 7.2 Deployment Prep

| ID    | Task                               | Priority | Status | Notes |
| ----- | ---------------------------------- | -------- | ------ | ----- |
| 7.2.1 | ⬜ Create production build scripts | 🟠 P1    |        |       |
| 7.2.2 | ⬜ Test production build           | 🟠 P1    |        |       |
| 7.2.3 | ⬜ Document deployment steps       | 🟠 P1    |        |       |
| 7.2.4 | ⬜ Create database backup script   | 🟡 P2    |        |       |

---

## Summary

### Task Counts by Priority

| Priority | Count | Description  |
| -------- | ----- | ------------ |
| 🔴 P0    | ~100  | MVP Critical |
| 🟠 P1    | ~80   | Important    |
| 🟡 P2    | ~15   | Nice to have |

### Task Counts by Phase

| Phase                      | Tasks | Priority Focus |
| -------------------------- | ----- | -------------- |
| Phase 0: Setup             | ~25   | P0             |
| Phase 1: Backend Core      | ~30   | P0             |
| Phase 2: Backend Features  | ~65   | P0/P1          |
| Phase 3: Frontend Core     | ~30   | P0             |
| Phase 4: Frontend Features | ~60   | P0/P1          |
| Phase 5: Integration       | ~15   | P0/P1          |
| Phase 6: Testing           | ~20   | P1             |
| Phase 7: Documentation     | ~10   | P0/P1          |

### Estimated Timeline

| Phase     | Estimated Duration |
| --------- | ------------------ |
| Phase 0   | 0.5 - 1 day        |
| Phase 1   | 1 - 2 days         |
| Phase 2   | 3 - 4 days         |
| Phase 3   | 1 - 2 days         |
| Phase 4   | 4 - 5 days         |
| Phase 5   | 1 - 2 days         |
| Phase 6   | 2 - 3 days         |
| Phase 7   | 0.5 - 1 day        |
| **Total** | **~14-20 days**    |

---

## Progress Tracking

### Overall Progress

```
Phase 0: Setup           [██████████] 100% ✅
Phase 1: Backend Core    [██████████] 100% ✅
Phase 2: Backend Features[██████████] 100% ✅
Phase 3: Frontend Core   [██████████] 100% ✅
Phase 4: Frontend Features[██████████] 100% ✅
Phase 5: Integration     [████████░░] 80%
Phase 6: Testing         [███░░░░░░░] 30%
Phase 7: Documentation   [██████████] 100% ✅
─────────────────────────────────────
Total Progress           [█████████░] ~90%
```

### Quick Stats

| Metric      | Value |
| ----------- | ----- |
| Total Tasks | ~255  |
| Completed   | ~230  |
| In Progress | ~10   |
| Remaining   | ~15   |

### Completed Milestones

- ✅ **Phase 0**: Monorepo structure, configs, dependencies
- ✅ **Phase 1**: Database, error handling, validation, logging
- ✅ **Phase 2**: Categories, Products, Inventory, Reports APIs
- ✅ **Phase 3**: UI components, layout, API client, stores
- ✅ **Phase 4**: All feature pages (Dashboard, Categories, Products, Inventory, Reports)
- ✅ **Phase 5**: Integration testing (manual), bug fixes, UI polish
- ✅ **Phase 7**: README, all documentation files

### Additional Features Implemented

- ✅ Custom Dropdown component (fully styled, accessible)
- ✅ Product sorting (price/stock ascending/descending)
- ✅ Product inventory history modal (eye icon per product)
- ✅ Search from first character
- ✅ Dashboard real-time cache invalidation
- ✅ Custom toast notification styling

### Remaining Work

- 🔄 **Phase 6**: Additional unit tests, 70% coverage target
- 🔄 E2E automated testing (optional)

---

_Last Updated: November 28, 2024_
