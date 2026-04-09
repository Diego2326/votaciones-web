import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/app/store/auth.store'
import { getDefaultRouteForUser } from '@/core/utils/authRoutes'
import { authApi } from '@/features/auth/api/authApi'

export function useRegister() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setSession = useAuthStore((state) => state.setSession)
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: async (payload: Parameters<typeof authApi.register>[0]) => {
      const response = await authApi.register(payload)

      setSession(response)

      try {
        const user = await authApi.me()
        setUser(user)
        queryClient.setQueryData(['auth', 'me'], user)
        return {
          ...response,
          user,
        }
      } catch {
        if (response.user) {
          queryClient.setQueryData(['auth', 'me'], response.user)
        }
        return response
      }
    },
    onSuccess: (session) => {
      navigate(getDefaultRouteForUser(session.user), { replace: true })
    },
  })
}
