import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

import { useAuthStore } from '@/app/store/auth.store'
import { toAppError } from '@/core/utils/errors'
import { authApi } from '@/features/auth/api/authApi'

export function useCurrentUser() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const clearSession = useAuthStore((state) => state.clearSession)

  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.me,
    enabled: Boolean(accessToken) && !user,
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (query.data) {
      setUser(query.data)
    }
  }, [query.data, setUser])

  useEffect(() => {
    if (
      !user &&
      accessToken &&
      query.isError &&
      [401, 403].includes(toAppError(query.error).status ?? 0)
    ) {
      clearSession()
    }
  }, [accessToken, clearSession, query.error, query.isError, user])

  return query
}
