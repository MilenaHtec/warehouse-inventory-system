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
        gutter={12}
        containerStyle={{
          top: 20,
          right: 20,
        }}
        toastOptions={{
          duration: 3500,
          style: {
            padding: '14px 18px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '500',
            maxWidth: '360px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
          },
          success: {
            style: {
              background: '#e3e7dc', // olive-100
              color: '#404c35', // olive-700
              border: '1px solid #c8d1ba', // olive-200
            },
            iconTheme: {
              primary: '#516141', // olive-600
              secondary: '#f6f7f4', // olive-50
            },
          },
          error: {
            style: {
              background: '#fce7e4', // brick-100
              color: '#8d3124', // brick-800
              border: '1px solid #f5b3a8', // brick-300
            },
            iconTheme: {
              primary: '#cc4532', // brick-600
              secondary: '#fdf4f3', // brick-50
            },
          },
        }}
      />
    </QueryClientProvider>
  </StrictMode>
);
