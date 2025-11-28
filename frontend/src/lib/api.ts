import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

// API Error Response type
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

// Create Axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    // Handle API errors
    const { status, data } = error.response;

    switch (status) {
      case 400:
        // Validation error
        if (data?.error?.details) {
          const messages = Object.values(data.error.details).flat();
          toast.error(messages[0] || 'Validation error');
        } else {
          toast.error(data?.error?.message || 'Bad request');
        }
        break;

      case 404:
        toast.error(data?.error?.message || 'Resource not found');
        break;

      case 409:
        toast.error(data?.error?.message || 'Conflict error');
        break;

      case 422:
        toast.error(data?.error?.message || 'Business rule violation');
        break;

      case 500:
        toast.error('Server error. Please try again later.');
        break;

      default:
        toast.error(data?.error?.message || 'An error occurred');
    }

    return Promise.reject(error);
  }
);

// Helper to extract error message
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiErrorResponse;
    return apiError?.error?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

