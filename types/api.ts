import { UseQueryOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export type QueryHookOptions<TQueryFnData = unknown> = Omit<
  UseQueryOptions<TQueryFnData>,
  "queryKey" | "queryFn"
>;

import DefaultObject = Utility.DefaultObject;

export type ErrorResponse = AxiosResponse<{ message: string }>;

export type DefaultResponse<T extends DefaultObject = { message: string }> =
  AxiosResponse<
    T & {
      message: string;
    }
  >;
