export const storageKeys = {
  accessToken: 'votaciones.accessToken',
  refreshToken: 'votaciones.refreshToken',
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
}
