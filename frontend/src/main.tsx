import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#292524',
            color: '#f5f5f4',
            borderRadius: '0.75rem',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#f5f5f4',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#f5f5f4',
            },
          },
        }}
      />
    </QueryClientProvider>
  </StrictMode>
);

