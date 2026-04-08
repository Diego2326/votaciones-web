import { create } from 'zustand'

import type { User } from '@/core/types/domain'
import { storage, storageKeys } from '@/core/utils/storage'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  hydrated: boolean
  setSession: (payload: {
    accessToken: string
    refreshToken: string
    user?: User
  }) => void
  setUser: (user: User | null) => void
  clearSession: () => void
  hydrate: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  hydrated: false,
  setSession: ({ accessToken, refreshToken, user }) => {
    storage.set(storageKeys.accessToken, accessToken)
    storage.set(storageKeys.refreshToken, refreshToken)

    set({
      accessToken,
      refreshToken,
      user: user ?? null,
      hydrated: true,
    })
  },
  setUser: (user) => set({ user }),
  clearSession: () => {
    storage.clearAuth()
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      hydrated: true,
    })
  },
  hydrate: () =>
    set({
      accessToken: storage.get(storageKeys.accessToken),
      refreshToken: storage.get(storageKeys.refreshToken),
      hydrated: true,
    }),
}))
