import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/app/store/auth.store'
import { getDefaultRouteForUser } from '@/core/utils/authRoutes'
import { authApi } from '@/features/auth/api/authApi'

export function useRegister() {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      setSession(response)
      navigate(getDefaultRouteForUser(response.user), { replace: true })
    },
  })
}
