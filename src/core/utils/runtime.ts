declare global {
  // `sockjs-client` expects a Node-like `global` symbol in some browser builds.
  var global: typeof globalThis | undefined

  interface Window {
    global?: typeof globalThis
  }
}

const runtimeGlobal = globalThis as typeof globalThis & {
  global?: typeof globalThis
}

if (typeof runtimeGlobal.global === 'undefined') {
  runtimeGlobal.global = globalThis
}

if (typeof window !== 'undefined' && typeof window.global === 'undefined') {
  window.global = globalThis
}

export {}
