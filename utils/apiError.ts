import { AxiosError } from 'axios';

type ErrorDetails = Record<string, { message?: string } | string>;

type ApiErrorResponse = {
  message?: string;
  error?: {
    message?: string;
    details?: ErrorDetails;
  };
};

const getDetailMessages = (details?: ErrorDetails) => {
  if (!details) {
    return [];
  }

  return Object.values(details)
    .map((detail) => {
      if (typeof detail === 'string') {
        return detail;
      }

      return detail.message;
    })
    .filter((message): message is string => Boolean(message?.trim()));
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong'
) => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    const detailMessages = getDetailMessages(data?.error?.details);

    if (detailMessages.length > 0) {
      return detailMessages.join(', ');
    }

    if (data?.error?.message?.trim()) {
      return data.error.message;
    }

    if (data?.message?.trim()) {
      return data.message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
};
