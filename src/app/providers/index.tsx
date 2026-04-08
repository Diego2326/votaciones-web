import { QueryClientProvider } from '@tanstack/react-query'
import { type PropsWithChildren, useEffect } from 'react'

import { useAuthStore } from '@/app/store/auth.store'
import { AppErrorBoundary } from '@/components/feedback/AppErrorBoundary'
import { ToastViewport } from '@/components/feedback/ToastViewport'
import { queryClient } from '@/core/utils/query'

export function AppProviders({ children }: PropsWithChildren) {
  const hydrate = useAuthStore((state) => state.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {children}
        <ToastViewport />
      </QueryClientProvider>
    </AppErrorBoundary>
  )
}
