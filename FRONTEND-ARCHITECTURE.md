# Frontend Architecture Document

## Overview

The frontend is a **Single Page Application (SPA)** built with React and TypeScript. It provides a modern, responsive user interface for managing warehouse inventory, including products, categories, and stock operations.

---

## Technology Stack

| Category       | Technology          | Version  | Purpose                                |
| -------------- | ------------------- | -------- | -------------------------------------- |
| Framework      | React               | 18.x     | UI component library                   |
| Build Tool     | Vite                | 5.x      | Fast development and bundling          |
| Language       | TypeScript          | 5.x      | Type safety                            |
| Styling        | Tailwind CSS        | 3.x      | Utility-first CSS framework            |
| State          | Zustand             | 4.x      | Global state management                |
| Server State   | TanStack Query      | 5.x      | Data fetching and caching              |
| Forms          | React Hook Form     | 7.x      | Form state and validation              |
| Validation     | Zod                 | 3.x      | Schema validation                      |
| Routing        | React Router        | 6.x      | Client-side routing                    |
| HTTP Client    | Axios               | 1.x      | API communication                      |
| Tables         | TanStack Table      | 8.x      | Data tables with sorting/filtering     |
| Icons          | Lucide React        | latest   | Icon library                           |
| Notifications  | React Hot Toast     | 2.x      | Toast notifications                    |
| Testing        | Vitest + RTL        | latest   | Unit and integration testing           |

---

## Application Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND APPLICATION                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                         PRESENTATION                             │   │
│  │  ┌─────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │   │
│  │  │  Pages  │  │  Components │  │   Layouts   │  │   Icons   │  │   │
│  │  └─────────┘  └─────────────┘  └─────────────┘  └───────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                         APPLICATION                              │   │
│  │  ┌─────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │   │
│  │  │  Hooks  │  │   Context   │  │  Providers  │  │  Router   │  │   │
│  │  └─────────┘  └─────────────┘  └─────────────┘  └───────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                        STATE MANAGEMENT                          │   │
│  │  ┌─────────────────┐  ┌─────────────────────────────────────┐  │   │
│  │  │  Zustand Store  │  │  TanStack Query (Server State)      │  │   │
│  │  │  (UI State)     │  │  - Caching                          │  │   │
│  │  │  - Modals       │  │  - Background updates               │  │   │
│  │  │  - Filters      │  │  - Optimistic updates               │  │   │
│  │  │  - Sidebar      │  │  - Loading/Error states             │  │   │
│  │  └─────────────────┘  └─────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                           SERVICES                               │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │   │
│  │  │ API Client  │  │  Services   │  │  Interceptors/Handlers  │  │   │
│  │  │  (Axios)    │  │  (per entity)│  │  (Auth, Errors)        │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP (REST/JSON)
                              ▼
                    ┌─────────────────┐
                    │   Backend API   │
                    └─────────────────┘
```

---

## Directory Structure

```
frontend/
├── src/
│   ├── components/                 # Reusable UI components
│   │   ├── ui/                     # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── forms/                  # Form components
│   │   │   ├── ProductForm.tsx
│   │   │   ├── CategoryForm.tsx
│   │   │   ├── StockChangeForm.tsx
│   │   │   └── SearchForm.tsx
│   │   │
│   │   ├── tables/                 # Table components
│   │   │   ├── ProductsTable.tsx
│   │   │   ├── CategoriesTable.tsx
│   │   │   ├── InventoryHistoryTable.tsx
│   │   │   └── DataTable.tsx       # Generic table wrapper
│   │   │
│   │   ├── layout/                 # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MainLayout.tsx
│   │   │   └── PageHeader.tsx
│   │   │
│   │   └── feedback/               # Feedback components
│   │       ├── ErrorBoundary.tsx
│   │       ├── EmptyState.tsx
│   │       ├── LoadingState.tsx
│   │       └── ConfirmDialog.tsx
│   │
│   ├── pages/                      # Page components (routes)
│   │   ├── Dashboard.tsx           # Overview with stats
│   │   ├── Products/
│   │   │   ├── ProductList.tsx     # Product listing
│   │   │   ├── ProductDetail.tsx   # Single product view
│   │   │   └── ProductCreate.tsx   # Create new product
│   │   ├── Categories/
│   │   │   ├── CategoryList.tsx
│   │   │   └── CategoryDetail.tsx
│   │   ├── Inventory/
│   │   │   ├── StockManagement.tsx # Increase/decrease stock
│   │   │   └── InventoryHistory.tsx
│   │   ├── Reports/
│   │   │   ├── StockByCategory.tsx
│   │   │   └── LowStockReport.tsx
│   │   └── NotFound.tsx
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── api/                    # API-related hooks
│   │   │   ├── useProducts.ts
│   │   │   ├── useCategories.ts
│   │   │   ├── useInventory.ts
│   │   │   └── useReports.ts
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── useConfirm.ts
│   │
│   ├── services/                   # API services
│   │   ├── api.ts                  # Axios instance & config
│   │   ├── products.service.ts
│   │   ├── categories.service.ts
│   │   ├── inventory.service.ts
│   │   └── reports.service.ts
│   │
│   ├── stores/                     # Zustand stores
│   │   ├── useUIStore.ts           # UI state (modals, sidebar)
│   │   └── useFilterStore.ts       # Filter/search state
│   │
│   ├── types/                      # TypeScript types
│   │   ├── product.types.ts
│   │   ├── category.types.ts
│   │   ├── inventory.types.ts
│   │   └── api.types.ts
│   │
│   ├── utils/                      # Utility functions
│   │   ├── formatters.ts           # Date, currency formatting
│   │   ├── validators.ts           # Zod schemas
│   │   └── constants.ts            # App constants
│   │
│   ├── styles/                     # Global styles
│   │   └── globals.css             # Tailwind imports
│   │
│   ├── App.tsx                     # Root component with routes
│   ├── main.tsx                    # Entry point
│   └── vite-env.d.ts               # Vite type definitions
│
├── public/                         # Static assets
│   └── favicon.ico
│
├── tests/                          # Test files
│   ├── components/
│   ├── hooks/
│   └── utils/
│
├── index.html                      # HTML template
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── .env.example
```

---

## Page Structure & Routing

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           APPLICATION ROUTES                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  /                        → Dashboard (overview, stats)                 │
│                                                                         │
│  /products                → ProductList (table with CRUD)               │
│  /products/new            → ProductCreate (form)                        │
│  /products/:id            → ProductDetail (view/edit)                   │
│                                                                         │
│  /categories              → CategoryList (table with CRUD)              │
│  /categories/:id          → CategoryDetail (view products)              │
│                                                                         │
│  /inventory               → StockManagement (increase/decrease)         │
│  /inventory/history       → InventoryHistory (audit log)                │
│                                                                         │
│  /reports/by-category     → StockByCategory (report)                    │
│  /reports/low-stock       → LowStockReport (report)                     │
│                                                                         │
│  *                        → NotFound (404)                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Route Configuration

```typescript
const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'products', element: <ProductList /> },
      { path: 'products/new', element: <ProductCreate /> },
      { path: 'products/:id', element: <ProductDetail /> },
      { path: 'categories', element: <CategoryList /> },
      { path: 'categories/:id', element: <CategoryDetail /> },
      { path: 'inventory', element: <StockManagement /> },
      { path: 'inventory/history', element: <InventoryHistory /> },
      { path: 'reports/by-category', element: <StockByCategory /> },
      { path: 'reports/low-stock', element: <LowStockReport /> },
    ],
  },
  { path: '*', element: <NotFound /> },
];
```

---

## Component Architecture

### Component Categories

| Category    | Purpose                              | Example                     |
| ----------- | ------------------------------------ | --------------------------- |
| UI          | Reusable base components             | Button, Input, Modal        |
| Forms       | Form-specific components             | ProductForm, SearchForm     |
| Tables      | Data display components              | ProductsTable, DataTable    |
| Layout      | Page structure components            | Header, Sidebar, MainLayout |
| Feedback    | User feedback components             | LoadingState, EmptyState    |
| Pages       | Route components                     | ProductList, Dashboard      |

### Component Template

```typescript
// components/ui/Button.tsx
import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2',
          // variant styles
          // size styles
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? <Spinner /> : children}
      </button>
    );
  }
);
```

---

## State Management

### UI State (Zustand)

```typescript
// stores/useUIStore.ts
import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  
  modalState: {
    isOpen: boolean;
    type: 'create' | 'edit' | 'delete' | null;
    data: unknown;
  };
  openModal: (type: string, data?: unknown) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  modalState: { isOpen: false, type: null, data: null },
  openModal: (type, data) => set({ modalState: { isOpen: true, type, data } }),
  closeModal: () => set({ modalState: { isOpen: false, type: null, data: null } }),
}));
```

### Server State (TanStack Query)

```typescript
// hooks/api/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '@/services/products.service';

export const useProducts = (filters?: ProductFilter) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsService.getAll(filters),
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productsService.getById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => productsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
```

---

## API Service Layer

### API Client Configuration

```typescript
// services/api.ts
import axios from 'axios';
import toast from 'react-hot-toast';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error?.message || 'An error occurred';
    
    if (error.response?.status === 404) {
      toast.error('Resource not found');
    } else if (error.response?.status === 400) {
      toast.error(message);
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);
```

### Service Example

```typescript
// services/products.service.ts
import { api } from './api';
import type { Product, CreateProductDto, UpdateProductDto, ProductFilter } from '@/types';

export const productsService = {
  getAll: async (filters?: ProductFilter): Promise<Product[]> => {
    const { data } = await api.get('/products', { params: filters });
    return data.data;
  },

  getById: async (id: number): Promise<Product> => {
    const { data } = await api.get(`/products/${id}`);
    return data.data;
  },

  create: async (dto: CreateProductDto): Promise<Product> => {
    const { data } = await api.post('/products', dto);
    return data.data;
  },

  update: async (id: number, dto: UpdateProductDto): Promise<Product> => {
    const { data } = await api.put(`/products/${id}`, dto);
    return data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  search: async (query: string): Promise<Product[]> => {
    const { data } = await api.get('/products/search', { params: { q: query } });
    return data.data;
  },
};
```

---

## Form Handling

### Form with Validation

```typescript
// components/forms/ProductForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  productCode: z.string().min(1, 'Product code is required').max(50),
  price: z.number().min(0, 'Price must be non-negative'),
  quantity: z.number().int().min(0, 'Quantity must be non-negative').default(0),
  categoryId: z.number().int().positive('Category is required'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => void;
  isLoading?: boolean;
}

export const ProductForm = ({ initialData, onSubmit, isLoading }: ProductFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          label="Product Name"
          {...register('name')}
          error={errors.name?.message}
        />
      </div>
      <div>
        <Input
          label="Product Code"
          {...register('productCode')}
          error={errors.productCode?.message}
        />
      </div>
      <div>
        <Input
          label="Price"
          type="number"
          step="0.01"
          {...register('price', { valueAsNumber: true })}
          error={errors.price?.message}
        />
      </div>
      <div>
        <CategorySelect
          {...register('categoryId', { valueAsNumber: true })}
          error={errors.categoryId?.message}
        />
      </div>
      <Button type="submit" isLoading={isLoading}>
        Save Product
      </Button>
    </form>
  );
};
```

---

## UI/UX Patterns

### Page Layout Pattern

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Header (Logo, Navigation, User menu)                                    │
├───────────────┬─────────────────────────────────────────────────────────┤
│               │                                                         │
│    Sidebar    │   Page Content                                          │
│               │   ┌─────────────────────────────────────────────────┐  │
│  - Dashboard  │   │  Page Header (Title, Actions)                   │  │
│  - Products   │   ├─────────────────────────────────────────────────┤  │
│  - Categories │   │                                                 │  │
│  - Inventory  │   │  Main Content                                   │  │
│  - Reports    │   │  (Tables, Forms, Cards)                         │  │
│               │   │                                                 │  │
│               │   │                                                 │  │
│               │   └─────────────────────────────────────────────────┘  │
│               │                                                         │
└───────────────┴─────────────────────────────────────────────────────────┘
```

### Loading States

```typescript
// Loading skeleton for tables
const TableSkeleton = () => (
  <div className="animate-pulse space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="h-12 bg-gray-200 rounded" />
    ))}
  </div>
);

// Loading state in component
const ProductList = () => {
  const { data, isLoading, error } = useProducts();

  if (isLoading) return <TableSkeleton />;
  if (error) return <ErrorState message={error.message} />;
  if (!data?.length) return <EmptyState message="No products found" />;

  return <ProductsTable data={data} />;
};
```

### Toast Notifications

```typescript
// Success notification
toast.success('Product created successfully');

// Error notification
toast.error('Failed to delete product');

// Custom notification
toast.custom((t) => (
  <div className={`${t.visible ? 'animate-enter' : 'animate-leave'}`}>
    Custom notification content
  </div>
));
```

---

## Error Handling

### Error Boundary

```typescript
// components/feedback/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-red-600">Something went wrong</h2>
          <p className="text-gray-600 mt-2">{this.state.error?.message}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Reload Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## Testing Strategy

### Component Testing

```typescript
// tests/components/ProductForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductForm } from '@/components/forms/ProductForm';

describe('ProductForm', () => {
  it('should render all form fields', () => {
    render(<ProductForm onSubmit={jest.fn()} />);
    
    expect(screen.getByLabelText(/product name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/product code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
  });

  it('should show validation errors', async () => {
    render(<ProductForm onSubmit={jest.fn()} />);
    
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  it('should call onSubmit with valid data', async () => {
    const onSubmit = jest.fn();
    render(<ProductForm onSubmit={onSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/product name/i), {
      target: { value: 'Test Product' },
    });
    // ... fill other fields
    
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Test Product',
      }));
    });
  });
});
```

### Hook Testing

```typescript
// tests/hooks/useProducts.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProducts } from '@/hooks/api/useProducts';

const wrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useProducts', () => {
  it('should fetch products', async () => {
    const { result } = renderHook(() => useProducts(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    
    expect(result.current.data).toHaveLength(3);
  });
});
```

---

## Environment Configuration

### Environment Variables

```bash
# .env.example
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Warehouse Inventory
VITE_APP_VERSION=1.0.0
```

### Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

---

## Performance Considerations

| Technique              | Implementation                                      |
| ---------------------- | --------------------------------------------------- |
| Code Splitting         | React.lazy() for route components                   |
| Memoization            | useMemo, useCallback for expensive operations       |
| Virtual Lists          | TanStack Virtual for large lists                    |
| Debounced Search       | useDebounce hook for search inputs                  |
| Optimistic Updates     | TanStack Query optimistic mutations                 |
| Image Optimization     | Lazy loading, proper sizing                         |
| Bundle Analysis        | vite-plugin-visualizer for bundle inspection        |

---

## Accessibility (a11y)

| Feature                | Implementation                                      |
| ---------------------- | --------------------------------------------------- |
| Keyboard Navigation    | Focus management, tab order                         |
| Screen Readers         | ARIA labels, semantic HTML                          |
| Color Contrast         | WCAG 2.1 AA compliance                              |
| Focus Indicators       | Visible focus rings                                 |
| Error Announcements    | aria-live regions for dynamic content               |

---

## Related Documentation

| Document           | Description                               |
| ------------------ | ----------------------------------------- |
| `ARCHITECTURE.md`  | Full-stack system architecture            |
| `DATA-MODEL.md`    | Backend data model and types              |
| `API.md`           | API endpoint documentation                |
| `TESTING.md`       | Complete testing strategy                 |

