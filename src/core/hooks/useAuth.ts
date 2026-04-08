import { useMemo } from 'react'

import { useAuthStore } from '@/app/store/auth.store'

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const accessToken = useAuthStore((state) => state.accessToken)
  const refreshToken = useAuthStore((state) => state.refreshToken)
  const hydrated = useAuthStore((state) => state.hydrated)
  const clearSession = useAuthStore((state) => state.clearSession)

  return useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      hydrated,
      isAuthenticated: Boolean(accessToken),
      clearSession,
    }),
    [accessToken, clearSession, hydrated, refreshToken, user],
  )
}
