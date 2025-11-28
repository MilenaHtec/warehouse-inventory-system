# Development Rules & Best Practices

## Overview

This document defines the coding standards, conventions, and best practices for the Warehouse Inventory System. All contributors must follow these guidelines to maintain code quality and consistency.

---

## Table of Contents

1. [General Principles](#general-principles)
2. [Git Workflow](#git-workflow)
3. [TypeScript Guidelines](#typescript-guidelines)
4. [Backend Rules](#backend-rules)
5. [Frontend Rules](#frontend-rules)
6. [Database Rules](#database-rules)
7. [Testing Rules](#testing-rules)
8. [Security Rules](#security-rules)
9. [Performance Rules](#performance-rules)
10. [Documentation Rules](#documentation-rules)

---

## General Principles

### Code Quality

| Principle | Description |
|-----------|-------------|
| **DRY** | Don't Repeat Yourself - Extract common logic into reusable functions |
| **KISS** | Keep It Simple, Stupid - Prefer simple solutions over complex ones |
| **YAGNI** | You Aren't Gonna Need It - Don't add functionality until needed |
| **Single Responsibility** | Each function/class should do one thing well |
| **Fail Fast** | Validate early and throw errors immediately |

### Code Style

```
✅ DO:
- Write self-documenting code with meaningful names
- Keep functions small (< 30 lines ideally)
- Keep files focused (< 300 lines ideally)
- Use consistent formatting (Prettier)
- Add comments only when "why" isn't obvious

❌ DON'T:
- Use magic numbers or strings (use constants)
- Leave commented-out code in commits
- Use abbreviations that aren't widely known
- Write deeply nested code (> 3 levels)
- Ignore linter warnings
```

---

## Git Workflow

### Branch Naming

```
feature/    → New features         → feature/add-product-search
bugfix/     → Bug fixes            → bugfix/fix-stock-validation
hotfix/     → Production fixes     → hotfix/fix-critical-error
refactor/   → Code refactoring     → refactor/improve-api-structure
docs/       → Documentation        → docs/update-readme
test/       → Test additions       → test/add-service-tests
```

### Commit Messages

Follow **Conventional Commits** specification:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

#### Types

| Type       | Description                              |
|------------|------------------------------------------|
| `feat`     | New feature                              |
| `fix`      | Bug fix                                  |
| `docs`     | Documentation changes                    |
| `style`    | Formatting, missing semicolons, etc.     |
| `refactor` | Code refactoring                         |
| `test`     | Adding or updating tests                 |
| `chore`    | Build tasks, dependencies, configs       |
| `perf`     | Performance improvements                 |

#### Examples

```bash
# Good
feat(products): add search functionality
fix(inventory): prevent negative stock values
docs(api): update endpoint documentation
refactor(services): extract validation logic
test(products): add unit tests for ProductService

# Bad
updated stuff
fix bug
WIP
asdfasdf
```

### Pull Request Rules

```
✅ DO:
- Keep PRs small and focused (< 400 lines)
- Write clear PR descriptions
- Link related issues
- Request reviews from relevant team members
- Resolve all comments before merging
- Ensure CI passes

❌ DON'T:
- Merge your own PR without review
- Force push to shared branches
- Include unrelated changes
- Leave PRs open for more than 3 days
```

---

## TypeScript Guidelines

### Type Safety

```typescript
// ✅ DO: Use explicit types
function getProduct(id: number): Promise<Product> { }

// ❌ DON'T: Use 'any'
function getProduct(id: any): any { }

// ✅ DO: Use strict null checks
function findProduct(id: number): Product | null { }

// ❌ DON'T: Use non-null assertion carelessly
const product = findProduct(id)!; // Dangerous!

// ✅ DO: Validate and handle null
const product = findProduct(id);
if (!product) {
  throw new NotFoundError('Product', id);
}
```

### Interfaces vs Types

```typescript
// Use interfaces for object shapes (extendable)
interface Product {
  id: number;
  name: string;
  price: number;
}

// Use types for unions, intersections, and primitives
type ChangeType = 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT';
type ProductWithCategory = Product & { category: Category };
type ID = number;
```

### Naming Conventions

| Element        | Convention      | Example                    |
|----------------|-----------------|----------------------------|
| Variables      | camelCase       | `productName`, `totalStock`|
| Constants      | UPPER_SNAKE     | `MAX_QUANTITY`, `API_URL`  |
| Functions      | camelCase       | `getProduct`, `calculateTotal` |
| Classes        | PascalCase      | `ProductService`, `AppError` |
| Interfaces     | PascalCase      | `Product`, `CreateProductDto` |
| Types          | PascalCase      | `ChangeType`, `ApiResponse` |
| Files          | kebab-case      | `product.service.ts`       |
| Components     | PascalCase      | `ProductList.tsx`          |
| Enums          | PascalCase      | `ChangeType`, `HttpStatus` |

### Import Order

```typescript
// 1. External libraries
import express from 'express';
import { z } from 'zod';

// 2. Internal modules (absolute paths)
import { ProductService } from '@/services/product.service';
import { Product } from '@/types';

// 3. Relative imports
import { validateProduct } from './validators';
import { CONSTANTS } from './constants';

// 4. Type imports (if separate)
import type { Request, Response } from 'express';
```

---

## Backend Rules

### Project Structure

```
✅ DO:
- Follow layered architecture (Controller → Service → Repository)
- Keep controllers thin (only request/response handling)
- Put business logic in services
- Put data access in repositories
- Use dependency injection

❌ DON'T:
- Access database directly from controllers
- Put business logic in controllers
- Mix concerns between layers
- Create circular dependencies
```

### Controllers

```typescript
// ✅ DO: Keep controllers simple
export class ProductController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await this.productService.create(req.body);
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }
}

// ❌ DON'T: Put business logic in controllers
export class ProductController {
  async create(req: Request, res: Response) {
    // BAD: Business logic in controller
    if (req.body.price < 0) {
      throw new Error('Invalid price');
    }
    const db = getDatabase();
    const result = db.prepare('INSERT INTO...').run(...);
    // ...
  }
}
```

### Services

```typescript
// ✅ DO: Single responsibility, clear methods
export class InventoryService {
  async decreaseStock(productId: number, quantity: number, reason?: string) {
    const product = await this.productRepo.findById(productId);
    
    if (!product) {
      throw Errors.productNotFound(productId);
    }
    
    if (product.quantity < quantity) {
      throw Errors.insufficientStock(quantity, product.quantity);
    }
    
    return this.executeStockChange(product, -quantity, 'STOCK_OUT', reason);
  }
}

// ❌ DON'T: God classes with too many responsibilities
export class InventoryService {
  async doEverything(action: string, data: any) {
    if (action === 'decrease') { /* ... */ }
    if (action === 'increase') { /* ... */ }
    if (action === 'report') { /* ... */ }
    // ... hundreds of lines
  }
}
```

### Error Handling

```typescript
// ✅ DO: Use custom error classes
throw new NotFoundError('Product', productId);
throw new ValidationError('Invalid input', details);
throw Errors.insufficientStock(requested, available);

// ❌ DON'T: Throw generic errors
throw new Error('Something went wrong');
throw 'Error occurred';

// ✅ DO: Always use try/catch in async operations
try {
  await this.productService.create(data);
} catch (error) {
  next(error);
}

// ❌ DON'T: Ignore promise rejections
this.productService.create(data); // Unhandled if fails!
```

### API Response Format

```typescript
// ✅ DO: Consistent response structure
// Success
res.json({
  success: true,
  data: product,
  meta: { timestamp: new Date().toISOString() }
});

// Success with pagination
res.json({
  success: true,
  data: products,
  pagination: { page, limit, total, totalPages }
});

// Error (handled by global error handler)
{
  success: false,
  error: { code, message, details }
}

// ❌ DON'T: Inconsistent responses
res.json(product);  // No wrapper
res.json({ result: product });  // Different key
res.send({ error: 'Failed' });  // Different error format
```

---

## Frontend Rules

### Component Structure

```typescript
// ✅ DO: Organized component structure
// 1. Imports
import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/api/useProducts';

// 2. Types
interface ProductListProps {
  categoryId?: number;
}

// 3. Component
export const ProductList = ({ categoryId }: ProductListProps) => {
  // 4. Hooks (in order: state, context, custom, effects)
  const [search, setSearch] = useState('');
  const { data, isLoading } = useProducts({ categoryId, search });
  
  // 5. Handlers
  const handleSearch = (value: string) => {
    setSearch(value);
  };
  
  // 6. Render helpers (if needed)
  const renderProduct = (product: Product) => (
    <ProductCard key={product.id} product={product} />
  );
  
  // 7. Early returns (loading, error, empty)
  if (isLoading) return <LoadingState />;
  if (!data?.length) return <EmptyState />;
  
  // 8. Main render
  return (
    <div className="space-y-4">
      <SearchInput value={search} onChange={handleSearch} />
      <div className="grid gap-4">
        {data.map(renderProduct)}
      </div>
    </div>
  );
};
```

### Hooks Rules

```typescript
// ✅ DO: Custom hooks for reusable logic
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
};

// ✅ DO: API hooks with TanStack Query
export const useProducts = (filters?: ProductFilter) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsService.getAll(filters),
  });
};

// ❌ DON'T: Hooks inside conditions or loops
if (condition) {
  const [state, setState] = useState(); // BAD!
}
```

### State Management

```typescript
// ✅ DO: Use appropriate state solution
// - Local UI state → useState
// - Server state → TanStack Query
// - Global UI state → Zustand
// - Form state → React Hook Form

// ✅ DO: Keep state minimal
const [isOpen, setIsOpen] = useState(false);

// ❌ DON'T: Store derived state
const [products, setProducts] = useState([]);
const [filteredProducts, setFilteredProducts] = useState([]); // BAD!
// Instead, derive it:
const filteredProducts = useMemo(() => 
  products.filter(p => p.categoryId === selectedCategory),
  [products, selectedCategory]
);

// ❌ DON'T: Duplicate server state locally
const [products, setProducts] = useState([]); // BAD if using TanStack Query
```

### Styling with Tailwind

```typescript
// ✅ DO: Use design system classes
<button className="btn-primary">Save</button>
<input className="input-field" />
<div className="card">...</div>

// ✅ DO: Use consistent spacing
<div className="space-y-4">
  <Component />
  <Component />
</div>

// ✅ DO: Use cn() for conditional classes
import { cn } from '@/utils/cn';

<button className={cn(
  'px-4 py-2 rounded-md',
  variant === 'primary' && 'bg-olive text-white',
  variant === 'danger' && 'bg-brick text-white',
  disabled && 'opacity-50 cursor-not-allowed'
)} />

// ❌ DON'T: Use arbitrary values
<div className="mt-[13px] p-[7px]">  // BAD: Use spacing scale

// ❌ DON'T: Inline styles
<div style={{ marginTop: '20px' }}>  // BAD: Use Tailwind
```

### Form Handling

```typescript
// ✅ DO: Use React Hook Form with Zod
const schema = z.object({
  name: z.string().min(1, 'Required'),
  price: z.number().min(0, 'Must be positive'),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});

// ✅ DO: Show validation errors
<Input
  {...register('name')}
  error={errors.name?.message}
/>

// ❌ DON'T: Manual form state management
const [name, setName] = useState('');
const [nameError, setNameError] = useState('');
const [price, setPrice] = useState(0);
// ... tedious and error-prone
```

---

## Database Rules

### Query Safety

```typescript
// ✅ DO: Use parameterized queries
const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
const product = stmt.get(id);

// ❌ DON'T: String concatenation (SQL injection risk!)
const query = `SELECT * FROM products WHERE id = ${id}`; // DANGEROUS!
```

### Transactions

```typescript
// ✅ DO: Use transactions for multiple operations
const transaction = db.transaction(() => {
  productRepo.updateQuantity(productId, newQuantity);
  auditRepo.logChange(changeData);
});
transaction();

// ❌ DON'T: Multiple separate operations (data inconsistency risk)
await productRepo.updateQuantity(productId, newQuantity);
await auditRepo.logChange(changeData); // If this fails, data is inconsistent!
```

### Migrations

```typescript
// ✅ DO: Write reversible migrations
// 001_create_products.sql
-- Up
CREATE TABLE products (...);

-- Down
DROP TABLE products;

// ✅ DO: Never modify existing migrations
// Instead, create a new migration

// ❌ DON'T: Make destructive changes without backup plan
DROP TABLE products; // Where's the data going?
```

---

## Testing Rules

### Test Structure

```typescript
// ✅ DO: Follow AAA pattern (Arrange, Act, Assert)
describe('InventoryService', () => {
  describe('decreaseStock', () => {
    it('should decrease stock when quantity is available', async () => {
      // Arrange
      const product = { id: 1, quantity: 100 };
      mockProductRepo.findById.mockResolvedValue(product);
      
      // Act
      const result = await service.decreaseStock(1, 30);
      
      // Assert
      expect(result.product.quantity).toBe(70);
      expect(mockProductRepo.updateQuantity).toHaveBeenCalledWith(1, 70);
    });
    
    it('should throw InsufficientStockError when quantity exceeds available', async () => {
      // Arrange
      const product = { id: 1, quantity: 20 };
      mockProductRepo.findById.mockResolvedValue(product);
      
      // Act & Assert
      await expect(service.decreaseStock(1, 50))
        .rejects
        .toMatchObject({ code: 'INSUFFICIENT_STOCK' });
    });
  });
});
```

### Test Naming

```typescript
// ✅ DO: Descriptive test names
it('should throw NotFoundError when product does not exist', ...);
it('should return paginated products when page and limit provided', ...);
it('should create inventory history record on stock change', ...);

// ❌ DON'T: Vague test names
it('works', ...);
it('test1', ...);
it('should work correctly', ...);
```

### What to Test

```
✅ DO TEST:
- Business logic in services
- Edge cases (empty arrays, zero values, null)
- Error scenarios
- Validation rules
- API endpoints (integration)

❌ DON'T TEST:
- Third-party libraries
- Simple getters/setters
- Framework code
- Implementation details
```

### Mocking

```typescript
// ✅ DO: Mock at boundaries (repositories, external services)
const mockProductRepo = {
  findById: jest.fn(),
  create: jest.fn(),
};
const service = new ProductService(mockProductRepo);

// ❌ DON'T: Over-mock (testing mocks, not code)
jest.mock('./productService');
jest.mock('./productRepository');
jest.mock('./database');
// At this point, what are we even testing?
```

---

## Security Rules

### Input Validation

```typescript
// ✅ DO: Validate all input at API boundary
const schema = z.object({
  name: z.string().min(1).max(200),
  price: z.number().min(0),
  quantity: z.number().int().min(0),
});

app.post('/products', validate(schema), controller.create);

// ✅ DO: Sanitize user input
const safeName = sanitize(req.body.name);

// ❌ DON'T: Trust user input
const product = await createProduct(req.body); // Dangerous!
```

### Sensitive Data

```typescript
// ✅ DO: Use environment variables for secrets
const apiKey = process.env.API_KEY;

// ❌ DON'T: Hardcode secrets
const apiKey = 'sk-1234567890'; // NEVER!

// ✅ DO: Exclude sensitive data from logs
logger.info('User action', { userId: user.id }); // OK
logger.info('User action', { user }); // BAD if user has password

// ✅ DO: Use .env.example (without real values)
// .env.example
API_KEY=your-api-key-here
DATABASE_URL=sqlite:./database.db
```

### Error Messages

```typescript
// ✅ DO: Generic errors in production
if (process.env.NODE_ENV === 'production') {
  return { error: 'An error occurred' };
}

// ❌ DON'T: Expose internal details
return { 
  error: 'Database error: SQLITE_CONSTRAINT on products.product_code',
  stack: error.stack // NEVER in production!
};
```

---

## Performance Rules

### Backend Performance

```typescript
// ✅ DO: Use pagination for lists
app.get('/products', async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const products = await productService.findAll({ page, limit });
});

// ❌ DON'T: Return unlimited results
const allProducts = await productRepo.findAll(); // Could be thousands!

// ✅ DO: Use database indexes
CREATE INDEX idx_products_category ON products(category_id);

// ✅ DO: Select only needed fields
SELECT id, name, price FROM products; // Good
SELECT * FROM products; // Avoid if not needed
```

### Frontend Performance

```typescript
// ✅ DO: Memoize expensive computations
const sortedProducts = useMemo(() => 
  [...products].sort((a, b) => a.name.localeCompare(b.name)),
  [products]
);

// ✅ DO: Use React.lazy for code splitting
const ProductDetail = lazy(() => import('./pages/ProductDetail'));

// ✅ DO: Debounce search inputs
const debouncedSearch = useDebounce(searchTerm, 300);

// ❌ DON'T: Re-render unnecessarily
// Avoid inline objects/functions in render
<Component style={{ margin: 10 }} /> // Creates new object every render
<Button onClick={() => handleClick(id)} /> // Creates new function every render

// Better:
const style = useMemo(() => ({ margin: 10 }), []);
const handleButtonClick = useCallback(() => handleClick(id), [id]);
```

---

## Documentation Rules

### Code Comments

```typescript
// ✅ DO: Comment "why", not "what"
// Decrease stock before creating order to prevent overselling
await inventoryService.decreaseStock(productId, quantity);

// ❌ DON'T: State the obvious
// Loop through products
for (const product of products) { ... }

// ✅ DO: Use JSDoc for public APIs
/**
 * Decreases stock quantity for a product.
 * @param productId - The product ID
 * @param quantity - Amount to decrease (must be positive)
 * @param reason - Optional reason for the change
 * @throws {NotFoundError} If product doesn't exist
 * @throws {InsufficientStockError} If quantity exceeds available stock
 */
async decreaseStock(productId: number, quantity: number, reason?: string)
```

### README Files

```markdown
✅ DO include:
- Project description
- Prerequisites
- Installation steps
- How to run (dev/prod)
- How to test
- Environment variables
- API documentation link

❌ DON'T:
- Include sensitive information
- Let documentation get outdated
- Write walls of text without structure
```

---

## Code Review Checklist

Before approving a PR, verify:

### Functionality
- [ ] Code does what it's supposed to do
- [ ] Edge cases are handled
- [ ] Error handling is proper

### Code Quality
- [ ] Follows project conventions
- [ ] No code duplication
- [ ] Functions are small and focused
- [ ] Names are meaningful

### Testing
- [ ] Tests are included
- [ ] Tests pass
- [ ] Edge cases are tested

### Security
- [ ] Input is validated
- [ ] No hardcoded secrets
- [ ] No SQL injection risks

### Performance
- [ ] No N+1 queries
- [ ] Pagination for lists
- [ ] No memory leaks

### Documentation
- [ ] Complex logic is commented
- [ ] Public APIs have JSDoc
- [ ] README updated if needed

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           QUICK REFERENCE                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  NAMING:                                                                    │
│  • Variables/Functions: camelCase                                           │
│  • Classes/Interfaces: PascalCase                                           │
│  • Constants: UPPER_SNAKE_CASE                                              │
│  • Files: kebab-case.ts                                                     │
│                                                                             │
│  COMMITS:                                                                   │
│  • feat: New feature                                                        │
│  • fix: Bug fix                                                             │
│  • docs: Documentation                                                      │
│  • refactor: Code change                                                    │
│  • test: Tests                                                              │
│                                                                             │
│  ARCHITECTURE:                                                              │
│  • Controller → Service → Repository → Database                             │
│  • Validate at boundaries                                                   │
│  • Errors bubble up to global handler                                       │
│                                                                             │
│  TESTING:                                                                   │
│  • Arrange → Act → Assert                                                   │
│  • Mock at boundaries only                                                  │
│  • Test behavior, not implementation                                        │
│                                                                             │
│  NEVER:                                                                     │
│  • Use 'any' type                                                           │
│  • Concatenate SQL strings                                                  │
│  • Commit secrets                                                           │
│  • Skip error handling                                                      │
│  • Return unlimited results                                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

