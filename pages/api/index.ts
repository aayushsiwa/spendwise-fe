import { DefaultOptions, QueryClient } from '@tanstack/react-query';
import axios from 'axios';

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

export const PrivateAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
