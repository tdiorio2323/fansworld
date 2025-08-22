import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ReactNode } from 'react';

// Create a test query client with disabled retries and short cache times
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
      staleTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
  logger: {
    log: () => {},
    warn: () => {},
    error: () => {},
  },
});

// This utility creates a new QueryClient for each test and wraps the
// component/hook in a QueryClientProvider. This ensures that tests are
// completely isolated from each other.
export const createWrapper = ({ queryClient = createTestQueryClient() } = {}) => {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// Default wrapper for simple cases
export const TestWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const Wrapper = createWrapper();
  return <Wrapper>{children}</Wrapper>;
};

// Simplified wrapper without router for components that don't need routing
export const SimpleWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </QueryClientProvider>
  );
};