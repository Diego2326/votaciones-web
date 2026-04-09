import { create } from 'zustand'

import type { TournamentSession } from '@/core/types/domain'
import { storage, storageKeys } from '@/core/utils/storage'

interface JoinState {
  sessionToken: string | null
  session: TournamentSession | null
  hydrated: boolean
  setSession: (session: TournamentSession) => void
  clearSession: () => void
  hydrate: () => void
}

export const useJoinStore = create<JoinState>((set) => ({
  sessionToken: null,
  session: null,
  hydrated: false,
  setSession: (session) => {
    storage.set(storageKeys.tournamentSessionToken, session.sessionToken)
    storage.set(storageKeys.tournamentSession, JSON.stringify(session))

    set({
      sessionToken: session.sessionToken,
      session,
      hydrated: true,
    })
  },
  clearSession: () => {
    storage.clearTournamentSession()

    set({
      sessionToken: null,
      session: null,
      hydrated: true,
    })
  },
  hydrate: () => {
    const rawSession = storage.get(storageKeys.tournamentSession)
    let session: TournamentSession | null = null

    if (rawSession) {
      try {
        session = JSON.parse(rawSession) as TournamentSession
      } catch {
        storage.clearTournamentSession()
      }
    }

    set({
      sessionToken: storage.get(storageKeys.tournamentSessionToken),
      session,
      hydrated: true,
    })
  },
}))
