const getEnv = (key: 'VITE_API_URL' | 'VITE_WS_URL', fallback: string) =>
  import.meta.env[key]?.toString() ?? fallback

export const env = {
  apiUrl: getEnv('VITE_API_URL', 'http://localhost:8080'),
  wsUrl: getEnv('VITE_WS_URL', 'http://localhost:8080/ws'),
} as const
