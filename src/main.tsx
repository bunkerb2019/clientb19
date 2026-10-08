import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,
      gcTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
});


createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
  <StrictMode>
    <App />
  </StrictMode>
  </QueryClientProvider>,
)
