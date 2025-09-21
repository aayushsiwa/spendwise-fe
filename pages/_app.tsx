import { QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';

import { CategoriesContextProvider } from '@/lib/context/Categories/Categories';
import { RecordsContextProvider } from '@/lib/context/Records/Records';
import { ColorModeProvider } from '@/lib/context/ThemeContext';

import { queryClient } from './api';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <CategoriesContextProvider>
        <RecordsContextProvider>
          <ColorModeProvider>
            <Component {...pageProps} />
          </ColorModeProvider>
        </RecordsContextProvider>
      </CategoriesContextProvider>
    </QueryClientProvider>
  );
}
