import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './App';
import { PhoneFrame } from './components/PhoneFrame';
import { AuthProvider } from './context/AuthContext';
import { GlobalStyle } from './GlobalStyle';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 10_000 },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalStyle />
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <PhoneFrame>
            <App />
          </PhoneFrame>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
