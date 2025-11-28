# Warehouse Inventory System

A full-stack warehouse inventory management application built with Node.js, Express, React, and SQLite.

![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![React](https://img.shields.io/badge/React-18.3-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![SQLite](https://img.shields.io/badge/SQLite-3-lightgrey)

## Features

- **Product Management** - Add, edit, delete, and search products with sorting options
- **Category Organization** - Organize products into categories
- **Inventory Tracking** - Track stock levels with increase/decrease operations
- **Audit History** - Complete history of all inventory changes per product
- **Reports & Analytics** - Stock by category, low stock alerts, dashboard stats
- **Real-time Dashboard** - Live statistics with automatic updates
- **Modern UI** - Beautiful earthy color palette with responsive design

## Tech Stack

### Backend
- Node.js + Express.js
- TypeScript
- SQLite (better-sqlite3)
- Zod (validation)
- Winston (logging)
- Jest (testing)

### Frontend
- React 18 + Vite
- TypeScript
- Tailwind CSS
- TanStack Query (server state)
- Zustand (UI state)
- React Router
- React Hook Form + Zod
- Lucide React (icons)

## Project Structure

```
warehouse-inventory-system/
├── backend/
│   ├── src/
│   │   ├── config/        # Database, environment config
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── repositories/  # Database operations
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utilities, errors, logger
│   │   └── validators/    # Zod schemas
│   └── tests/             # Test files
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ui/        # Base UI components
│   │   │   ├── layout/    # Layout components
│   │   │   └── forms/     # Form components
│   │   ├── hooks/         # Custom hooks & TanStack Query
│   │   ├── lib/           # Utilities, API client
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service functions
│   │   └── stores/        # Zustand stores
│   └── public/            # Static assets
└── shared/
    └── types/             # Shared TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MilenaHtec/warehouse-inventory-system.git
   cd warehouse-inventory-system
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   
   Backend:
   ```bash
   cd ../backend
   cp .env.example .env
   ```
   
   Frontend:
   ```bash
   cd ../frontend
   cp .env.example .env
   ```

5. **Run database migrations**
   ```bash
   cd ../backend
   npm run db:migrate
   ```

6. **Seed the database (optional)**
   ```bash
   npm run db:seed
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on http://localhost:3000

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   App will open on http://localhost:5173

## API Endpoints

### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Products
- `GET /api/products` - List products (with pagination & filters)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/search?q=` - Search products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Inventory
- `POST /api/inventory/:productId/increase` - Increase stock
- `POST /api/inventory/:productId/decrease` - Decrease stock
- `POST /api/inventory/:productId/adjust` - Adjust stock
- `GET /api/inventory/:productId/history` - Get product history
- `GET /api/inventory/history` - Get all history

### Reports
- `GET /api/reports/dashboard` - Dashboard statistics
- `GET /api/reports/stock-by-category` - Stock grouped by category
- `GET /api/reports/low-stock` - Low stock products

## Environment Variables

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
DATABASE_PATH=./data/warehouse.db
LOG_LEVEL=info
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

## NPM Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [DATA-MODEL.md](./DATA-MODEL.md) - Database schema
- [API-SPEC.md](./API-SPEC.md) - API specification
- [FRONTEND-ARCHITECTURE.md](./FRONTEND-ARCHITECTURE.md) - Frontend structure
- [STYLE-GUIDE.md](./STYLE-GUIDE.md) - Design system
- [ERROR-HANDLING.md](./ERROR-HANDLING.md) - Error handling
- [TESTING.md](./TESTING.md) - Testing strategy
- [LOGGING.md](./LOGGING.md) - Logging configuration
- [RULES.md](./RULES.md) - Development guidelines
- [TASKS.md](./TASKS.md) - Implementation tasks
- [PRD.md](./PRD.md) - Product requirements

## License

MIT

