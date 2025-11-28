import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { Dashboard, NotFound } from '@/pages';

// Lazy load feature pages (will be added later)
// const Products = lazy(() => import('@/pages/Products'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          
          {/* Product routes - to be implemented */}
          <Route path="products" element={<ComingSoon title="Products" />} />
          
          {/* Category routes - to be implemented */}
          <Route path="categories" element={<ComingSoon title="Categories" />} />
          
          {/* Inventory routes - to be implemented */}
          <Route path="inventory" element={<ComingSoon title="Inventory" />} />
          
          {/* Report routes - to be implemented */}
          <Route path="reports" element={<ComingSoon title="Reports" />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// Placeholder for pages not yet implemented
function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-full bg-olive-100 flex items-center justify-center mb-4">
        <span className="text-2xl">🚧</span>
      </div>
      <h1 className="text-2xl font-semibold text-stone-900 mb-2">{title}</h1>
      <p className="text-stone-500">This page is coming soon.</p>
    </div>
  );
}

export default App;

