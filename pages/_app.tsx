import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';

import { queryClient } from '@/api';
import { CategoriesContextProvider } from '@/lib/context/Categories/Categories';
import { PeriodProvider } from '@/lib/context/Period/Period';
import { SnackbarProvider } from '@/lib/context/Snackbar/Snackbar';
import { ColorModeProvider } from '@/lib/context/ThemeContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SnackbarProvider>
      <ColorModeProvider>
        <QueryClientProvider client={queryClient}>
          <PeriodProvider>
            <CategoriesContextProvider>
              <Component {...pageProps} />
              <ReactQueryDevtools initialIsOpen={false} />
            </CategoriesContextProvider>
          </PeriodProvider>
        </QueryClientProvider>
      </ColorModeProvider>
    </SnackbarProvider>
  );
}
