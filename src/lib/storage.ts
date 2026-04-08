const memoryStorage = new Map<string, string>()

function getStorage() {
  if (typeof window === 'undefined') {
    return {
      getItem: (key: string) => memoryStorage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        memoryStorage.set(key, value)
      },
      removeItem: (key: string) => {
        memoryStorage.delete(key)
      },
    }
  }

  return window.localStorage
}

export function readStorage(key: string) {
  return getStorage().getItem(key)
}

export function writeStorage(key: string, value: string) {
  getStorage().setItem(key, value)
}

export function removeStorage(key: string) {
  getStorage().removeItem(key)
}
