import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { userApi } from '@/features/users/api/userApi'
import type { UserRolesPayload, UserStatusPayload } from '@/features/users/types/user.types'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: userApi.list,
  })
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UserStatusPayload }) =>
      userApi.updateStatus(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useUpdateUserRoles() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UserRolesPayload }) =>
      userApi.updateRoles(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
