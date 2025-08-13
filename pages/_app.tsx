import "@/styles/globals.css";
import { QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { queryClient } from "./api";
import { RecordsContextProvider } from "@/lib/context/Records/Records";
import { CategoriesContextProvider } from "@/lib/context/Categories/Categories";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <CategoriesContextProvider>
        <RecordsContextProvider>
          <Component {...pageProps} />
        </RecordsContextProvider>
      </CategoriesContextProvider>
    </QueryClientProvider>
  );
}
