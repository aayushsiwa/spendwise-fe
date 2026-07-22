import { DefaultOptions, QueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { baseApiURL } from '@/constants/config';

const queryClientOptions: DefaultOptions = {
  queries: {
    gcTime: 10 * 60 * 1000, // 10 minutes
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: false,
  },
};

export const queryClient = new QueryClient({
  defaultOptions: queryClientOptions,
});

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import('@tanstack/react-query').QueryClient;
  }
}

// This code is for all users
if (typeof window !== 'undefined') {
  window.__TANSTACK_QUERY_CLIENT__ = queryClient;
}

export const PrivateAxios = axios.create({
  baseURL: baseApiURL,
});
