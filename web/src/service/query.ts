import { AxiosError } from 'axios';
import { QueryClient } from "react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      retry: (failureCount, error) => {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            return false;
          }
        }
        return false;
      }
    },
  },
});