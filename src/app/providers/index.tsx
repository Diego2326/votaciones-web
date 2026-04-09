import { QueryClientProvider } from '@tanstack/react-query'
import { type PropsWithChildren, useEffect } from 'react'

import { useAuthStore } from '@/app/store/auth.store'
import { useJoinStore } from '@/app/store/join.store'
import { AppErrorBoundary } from '@/components/feedback/AppErrorBoundary'
import { ToastViewport } from '@/components/feedback/ToastViewport'
import { queryClient } from '@/core/utils/query'

export function AppProviders({ children }: PropsWithChildren) {
  const hydrateAuth = useAuthStore((state) => state.hydrate)
  const hydrateJoin = useJoinStore((state) => state.hydrate)

  useEffect(() => {
    hydrateAuth()
    hydrateJoin()
  }, [hydrateAuth, hydrateJoin])

  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {children}
        <ToastViewport />
      </QueryClientProvider>
    </AppErrorBoundary>
  )
}
