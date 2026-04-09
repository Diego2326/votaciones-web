const getEnv = (
  key: 'VITE_API_URL' | 'VITE_WS_URL' | 'VITE_IMGUR_CLIENT_ID',
  fallback: string,
) =>
  import.meta.env[key]?.toString() ?? fallback

export const env = {
  apiUrl: getEnv('VITE_API_URL', '/'),
  wsUrl: getEnv('VITE_WS_URL', '/ws'),
  imgurClientId: getEnv('VITE_IMGUR_CLIENT_ID', ''),
} as const
