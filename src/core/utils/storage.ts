export const storageKeys = {
  accessToken: 'votaciones.accessToken',
  refreshToken: 'votaciones.refreshToken',
  tournamentSessionToken: 'votaciones.tournamentSessionToken',
  tournamentSession: 'votaciones.tournamentSession',
} as const

export const storage = {
  get(key: string) {
    return window.localStorage.getItem(key)
  },
  set(key: string, value: string) {
    window.localStorage.setItem(key, value)
  },
  remove(key: string) {
    window.localStorage.removeItem(key)
  },
  clearAuth() {
    this.remove(storageKeys.accessToken)
    this.remove(storageKeys.refreshToken)
  },
  clearTournamentSession() {
    this.remove(storageKeys.tournamentSessionToken)
    this.remove(storageKeys.tournamentSession)
  },
}
