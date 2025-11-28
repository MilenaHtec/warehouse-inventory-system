# Warehouse Inventory System

## Overview

An inventory management tool designed to help retail stores and warehouses keep track of their products. Users can organize items into categories like Beverages, Snacks, or Household, view product details, and easily update quantities when stock changes.

---

## Functional Requirements

### Product Management
- **Add** new product information
- **Update** existing product details
- **Remove** products from the system

### Product Information
- View detailed product information including:
  - Name
  - Price
  - Product code

### Inventory Operations
- **Increase** stock quantities
- **Decrease** stock quantities
- **Prevent stock from going below zero** (validation)

### Search & Organization
- Sort product listings
- Filter product listings
- Quick and easy product search

### Reporting & Analytics
- Display **total stock per category**
- Show a **history of all inventory changes** (audit trail)

### Categories
The system should support organizing items into categories such as:
- Beverages
- Snacks
- Household
- *(and more as needed)*

---

## Non-Functional Requirements

### Testing
- **Unit test coverage of at least 70%**

### Error Handling
- Implement **global error catching** with appropriate error logging

---

## Technical Constraints

### Database
- Use a **lightweight relational database** that can run locally
- Recommended: **SQLite**

---

## Summary of Features

| Feature | Description |
|---------|-------------|
| Product CRUD | Add, update, and remove products |
| Stock Management | Increase/decrease quantities with validation |
| Category Organization | Group products by category |
| Search & Filter | Sort and filter product listings |
| Inventory History | Track all stock changes |
| Category Totals | View total products per category |
| Error Handling | Global error catching and logging |
| Testing | Minimum 70% unit test coverage |

