# API Specification

## Overview

This document provides the complete REST API specification for the Warehouse Inventory System backend. All endpoints follow RESTful conventions and return JSON responses.

---

## Base Configuration

| Property       | Value                           |
| -------------- | ------------------------------- |
| Base URL       | `http://localhost:3000/api`     |
| Content-Type   | `application/json`              |
| API Version    | `v1`                            |

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Success Response (Paginated)

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": [ ... ]
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Common Query Parameters

| Parameter  | Type    | Description                              | Example                |
| ---------- | ------- | ---------------------------------------- | ---------------------- |
| `page`     | integer | Page number (1-based)                    | `?page=2`              |
| `limit`    | integer | Items per page (max 100)                 | `?limit=20`            |
| `sort`     | string  | Sort field                               | `?sort=name`           |
| `order`    | string  | Sort order (asc/desc)                    | `?order=desc`          |
| `search`   | string  | Search term                              | `?search=coca`         |

---

## HTTP Status Codes

| Code | Meaning               | Usage                                    |
| ---- | --------------------- | ---------------------------------------- |
| 200  | OK                    | Successful GET, PUT, DELETE              |
| 201  | Created               | Successful POST (resource created)       |
| 400  | Bad Request           | Validation error, invalid input          |
| 404  | Not Found             | Resource not found                       |
| 409  | Conflict              | Duplicate resource, constraint violation |
| 500  | Internal Server Error | Unexpected server error                  |

---

## Products API

### GET /api/products

List all products with optional filtering, sorting, and pagination.

**Query Parameters:**

| Parameter    | Type    | Required | Description                    |
| ------------ | ------- | -------- | ------------------------------ |
| page         | integer | No       | Page number (default: 1)       |
| limit        | integer | No       | Items per page (default: 20)   |
| sort         | string  | No       | Sort by: name, price, quantity, createdAt |
| order        | string  | No       | asc or desc (default: asc)     |
| categoryId   | integer | No       | Filter by category             |
| minPrice     | number  | No       | Minimum price filter           |
| maxPrice     | number  | No       | Maximum price filter           |
| minQuantity  | integer | No       | Minimum quantity filter        |
| maxQuantity  | integer | No       | Maximum quantity filter        |
| search       | string  | No       | Search in name and productCode |

**Request:**

```http
GET /api/products?page=1&limit=10&categoryId=1&sort=name&order=asc
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Coca-Cola 2L",
      "productCode": "BEV-001",
      "price": 2.99,
      "quantity": 150,
      "categoryId": 1,
      "category": {
        "id": 1,
        "name": "Beverages"
      },
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

---

### GET /api/products/:id

Get a single product by ID.

**Path Parameters:**

| Parameter | Type    | Required | Description    |
| --------- | ------- | -------- | -------------- |
| id        | integer | Yes      | Product ID     |

**Request:**

```http
GET /api/products/1
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Coca-Cola 2L",
    "productCode": "BEV-001",
    "price": 2.99,
    "quantity": 150,
    "categoryId": 1,
    "category": {
      "id": 1,
      "name": "Beverages",
      "description": "Drinks and liquid products"
    },
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Response (404 Not Found):**

```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product with ID 999 not found"
  }
}
```

---

### GET /api/products/search

Search products by name or product code.

**Query Parameters:**

| Parameter | Type   | Required | Description    |
| --------- | ------ | -------- | -------------- |
| q         | string | Yes      | Search query   |
| limit     | integer| No       | Max results (default: 20) |

**Request:**

```http
GET /api/products/search?q=cola&limit=10
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Coca-Cola 2L",
      "productCode": "BEV-001",
      "price": 2.99,
      "quantity": 150,
      "categoryId": 1
    },
    {
      "id": 2,
      "name": "Coca-Cola Zero 2L",
      "productCode": "BEV-002",
      "price": 2.99,
      "quantity": 80,
      "categoryId": 1
    }
  ]
}
```

---

### POST /api/products

Create a new product.

**Request Body:**

| Field       | Type    | Required | Validation                    |
| ----------- | ------- | -------- | ----------------------------- |
| name        | string  | Yes      | 1-200 characters              |
| productCode | string  | Yes      | 1-50 characters, unique       |
| price       | number  | Yes      | >= 0, max 2 decimal places    |
| quantity    | integer | No       | >= 0, default: 0              |
| categoryId  | integer | Yes      | Must exist in categories      |

**Request:**

```http
POST /api/products
Content-Type: application/json

{
  "name": "Pepsi 2L",
  "productCode": "BEV-003",
  "price": 2.89,
  "quantity": 100,
  "categoryId": 1
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "Pepsi 2L",
    "productCode": "BEV-003",
    "price": 2.89,
    "quantity": 100,
    "categoryId": 1,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response (400 Bad Request - Validation Error):**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "name",
        "message": "Name is required"
      },
      {
        "field": "price",
        "message": "Price must be a non-negative number"
      }
    ]
  }
}
```

**Response (409 Conflict - Duplicate):**

```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_PRODUCT_CODE",
    "message": "Product with code 'BEV-003' already exists"
  }
}
```

---

### PUT /api/products/:id

Update an existing product.

**Path Parameters:**

| Parameter | Type    | Required | Description    |
| --------- | ------- | -------- | -------------- |
| id        | integer | Yes      | Product ID     |

**Request Body (all fields optional):**

| Field       | Type    | Validation                    |
| ----------- | ------- | ----------------------------- |
| name        | string  | 1-200 characters              |
| productCode | string  | 1-50 characters, unique       |
| price       | number  | >= 0, max 2 decimal places    |
| categoryId  | integer | Must exist in categories      |

**Note:** Quantity cannot be updated directly. Use inventory endpoints.

**Request:**

```http
PUT /api/products/1
Content-Type: application/json

{
  "name": "Coca-Cola Original 2L",
  "price": 3.29
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Coca-Cola Original 2L",
    "productCode": "BEV-001",
    "price": 3.29,
    "quantity": 150,
    "categoryId": 1,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### DELETE /api/products/:id

Delete a product.

**Path Parameters:**

| Parameter | Type    | Required | Description    |
| --------- | ------- | -------- | -------------- |
| id        | integer | Yes      | Product ID     |

**Request:**

```http
DELETE /api/products/1
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "message": "Product deleted successfully",
    "deletedId": 1
  }
}
```

---

## Categories API

### GET /api/categories

List all categories.

**Request:**

```http
GET /api/categories
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Beverages",
      "description": "Drinks and liquid products",
      "productCount": 15,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Snacks",
      "description": "Chips, cookies, and treats",
      "productCount": 23,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

### GET /api/categories/:id

Get a single category by ID.

**Request:**

```http
GET /api/categories/1
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Beverages",
    "description": "Drinks and liquid products",
    "productCount": 15,
    "totalStock": 1250,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### GET /api/categories/:id/products

Get all products in a category.

**Query Parameters:**

| Parameter | Type    | Required | Description                  |
| --------- | ------- | -------- | ---------------------------- |
| page      | integer | No       | Page number (default: 1)     |
| limit     | integer | No       | Items per page (default: 20) |
| sort      | string  | No       | Sort field                   |
| order     | string  | No       | asc or desc                  |

**Request:**

```http
GET /api/categories/1/products?page=1&limit=10
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Coca-Cola 2L",
      "productCode": "BEV-001",
      "price": 2.99,
      "quantity": 150,
      "categoryId": 1
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  }
}
```

---

### POST /api/categories

Create a new category.

**Request Body:**

| Field       | Type   | Required | Validation           |
| ----------- | ------ | -------- | -------------------- |
| name        | string | Yes      | 1-100 chars, unique  |
| description | string | No       | Max 500 characters   |

**Request:**

```http
POST /api/categories
Content-Type: application/json

{
  "name": "Dairy",
  "description": "Milk, cheese, and dairy products"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": 4,
    "name": "Dairy",
    "description": "Milk, cheese, and dairy products",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### PUT /api/categories/:id

Update a category.

**Request:**

```http
PUT /api/categories/1
Content-Type: application/json

{
  "description": "All beverages and drinks"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Beverages",
    "description": "All beverages and drinks",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### DELETE /api/categories/:id

Delete a category.

**Note:** Cannot delete a category that has products. Products must be reassigned or deleted first.

**Request:**

```http
DELETE /api/categories/1
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "message": "Category deleted successfully",
    "deletedId": 1
  }
}
```

**Response (409 Conflict - Has Products):**

```json
{
  "success": false,
  "error": {
    "code": "CATEGORY_HAS_PRODUCTS",
    "message": "Cannot delete category with existing products. Remove or reassign 15 products first."
  }
}
```

---

## Inventory API

### POST /api/inventory/:productId/increase

Increase stock quantity for a product.

**Path Parameters:**

| Parameter | Type    | Required | Description    |
| --------- | ------- | -------- | -------------- |
| productId | integer | Yes      | Product ID     |

**Request Body:**

| Field    | Type    | Required | Validation           |
| -------- | ------- | -------- | -------------------- |
| quantity | integer | Yes      | > 0                  |
| reason   | string  | No       | Max 500 characters   |

**Request:**

```http
POST /api/inventory/1/increase
Content-Type: application/json

{
  "quantity": 50,
  "reason": "New shipment received"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "product": {
      "id": 1,
      "name": "Coca-Cola 2L",
      "productCode": "BEV-001",
      "quantity": 200
    },
    "change": {
      "type": "STOCK_IN",
      "quantityBefore": 150,
      "quantityAfter": 200,
      "quantityChange": 50,
      "reason": "New shipment received"
    }
  }
}
```

---

### POST /api/inventory/:productId/decrease

Decrease stock quantity for a product.

**Request Body:**

| Field    | Type    | Required | Validation                              |
| -------- | ------- | -------- | --------------------------------------- |
| quantity | integer | Yes      | > 0, cannot exceed current stock        |
| reason   | string  | No       | Max 500 characters                      |

**Request:**

```http
POST /api/inventory/1/decrease
Content-Type: application/json

{
  "quantity": 10,
  "reason": "Sold to customer"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "product": {
      "id": 1,
      "name": "Coca-Cola 2L",
      "productCode": "BEV-001",
      "quantity": 190
    },
    "change": {
      "type": "STOCK_OUT",
      "quantityBefore": 200,
      "quantityAfter": 190,
      "quantityChange": -10,
      "reason": "Sold to customer"
    }
  }
}
```

**Response (400 Bad Request - Insufficient Stock):**

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Cannot decrease stock by 300. Current quantity is 200."
  }
}
```

---

### POST /api/inventory/:productId/adjust

Adjust stock to a specific quantity (for inventory corrections).

**Request Body:**

| Field       | Type    | Required | Validation           |
| ----------- | ------- | -------- | -------------------- |
| newQuantity | integer | Yes      | >= 0                 |
| reason      | string  | Yes      | Required for auditing|

**Request:**

```http
POST /api/inventory/1/adjust
Content-Type: application/json

{
  "newQuantity": 195,
  "reason": "Inventory count correction - 5 items damaged"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "product": {
      "id": 1,
      "name": "Coca-Cola 2L",
      "productCode": "BEV-001",
      "quantity": 195
    },
    "change": {
      "type": "ADJUSTMENT",
      "quantityBefore": 200,
      "quantityAfter": 195,
      "quantityChange": -5,
      "reason": "Inventory count correction - 5 items damaged"
    }
  }
}
```

---

### GET /api/inventory/:productId/history

Get stock change history for a product.

**Query Parameters:**

| Parameter | Type    | Required | Description                    |
| --------- | ------- | -------- | ------------------------------ |
| page      | integer | No       | Page number (default: 1)       |
| limit     | integer | No       | Items per page (default: 20)   |
| startDate | string  | No       | Filter from date (ISO 8601)    |
| endDate   | string  | No       | Filter to date (ISO 8601)      |
| type      | string  | No       | Filter by type (STOCK_IN, STOCK_OUT, ADJUSTMENT) |

**Request:**

```http
GET /api/inventory/1/history?page=1&limit=10
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "productId": 1,
      "changeType": "STOCK_OUT",
      "quantityBefore": 200,
      "quantityAfter": 190,
      "quantityChange": -10,
      "reason": "Sold to customer",
      "createdAt": "2024-01-15T14:30:00.000Z"
    },
    {
      "id": 4,
      "productId": 1,
      "changeType": "STOCK_IN",
      "quantityBefore": 150,
      "quantityAfter": 200,
      "quantityChange": 50,
      "reason": "New shipment received",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

## Reports API

### GET /api/reports/stock-by-category

Get total stock summary grouped by category.

**Request:**

```http
GET /api/reports/stock-by-category
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "categoryId": 1,
      "categoryName": "Beverages",
      "productCount": 15,
      "totalStock": 1250,
      "totalValue": 3750.50
    },
    {
      "categoryId": 2,
      "categoryName": "Snacks",
      "productCount": 23,
      "totalStock": 890,
      "totalValue": 2670.00
    }
  ],
  "summary": {
    "totalCategories": 4,
    "totalProducts": 65,
    "totalStock": 3500,
    "totalValue": 10500.00
  }
}
```

---

### GET /api/reports/inventory-history

Get complete inventory change history (all products).

**Query Parameters:**

| Parameter | Type    | Required | Description                    |
| --------- | ------- | -------- | ------------------------------ |
| page      | integer | No       | Page number (default: 1)       |
| limit     | integer | No       | Items per page (default: 50)   |
| startDate | string  | No       | Filter from date (ISO 8601)    |
| endDate   | string  | No       | Filter to date (ISO 8601)      |
| type      | string  | No       | Filter by change type          |
| productId | integer | No       | Filter by product              |

**Request:**

```http
GET /api/reports/inventory-history?startDate=2024-01-01&endDate=2024-01-31
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 100,
      "product": {
        "id": 1,
        "name": "Coca-Cola 2L",
        "productCode": "BEV-001"
      },
      "changeType": "STOCK_OUT",
      "quantityBefore": 200,
      "quantityAfter": 190,
      "quantityChange": -10,
      "reason": "Sold to customer",
      "createdAt": "2024-01-15T14:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 500,
    "totalPages": 10
  }
}
```

---

### GET /api/reports/low-stock

Get products with low stock levels.

**Query Parameters:**

| Parameter | Type    | Required | Description                    |
| --------- | ------- | -------- | ------------------------------ |
| threshold | integer | No       | Low stock threshold (default: 10) |

**Request:**

```http
GET /api/reports/low-stock?threshold=20
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "name": "Organic Milk 1L",
      "productCode": "DAI-001",
      "quantity": 5,
      "price": 4.99,
      "category": {
        "id": 4,
        "name": "Dairy"
      }
    },
    {
      "id": 12,
      "name": "Premium Coffee Beans",
      "productCode": "BEV-012",
      "quantity": 8,
      "price": 15.99,
      "category": {
        "id": 1,
        "name": "Beverages"
      }
    }
  ],
  "meta": {
    "threshold": 20,
    "count": 12
  }
}
```

---

## Health Check

### GET /api/health

Check API health status.

**Request:**

```http
GET /api/health
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "1.0.0",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "uptime": 86400,
    "database": "connected"
  }
}
```

---

## Rate Limiting

| Endpoint Type | Rate Limit          |
| ------------- | ------------------- |
| Read (GET)    | 100 requests/minute |
| Write (POST, PUT, DELETE) | 30 requests/minute |

**Response (429 Too Many Requests):**

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 60
  }
}
```

