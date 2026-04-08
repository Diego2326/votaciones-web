import { QueryClient } from '@tanstack/react-query'

import { toAppError } from '@/core/utils/errors'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        const appError = toAppError(error)
        if (appError.status === 401) {
          return false
        }

        return failureCount < 2
      },
    },
    mutations: {
      onError: (error) => {
        console.error(toAppError(error))
      },
    },
  },
})
