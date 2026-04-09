import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'

import { useAuthStore } from '@/app/store/auth.store'
import { useJoinStore } from '@/app/store/join.store'
import { env } from '@/core/config/env'
import type { ApiErrorResponse, ApiResponse } from '@/core/types/api'
import type { AuthApiResponse, AuthResponse } from '@/core/types/domain'

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean
  }
}

export const unauthenticatedClient = axios.create({
  baseURL: env.apiUrl,
})

export const apiClient = axios.create({
  baseURL: env.apiUrl,
})

export const sessionClient = axios.create({
  baseURL: env.apiUrl,
})

const unwrap = <T>(response: { data: ApiResponse<T> | T }) =>
  response.data as ApiResponse<T> | T

function hasEnvelope<T>(payload: ApiResponse<T> | T): payload is ApiResponse<T> {
  return typeof payload === 'object' && payload !== null && 'data' in payload
}

let refreshPromise: Promise<string | null> | null = null

function normalizeAuthResponse(payload: AuthApiResponse): AuthResponse {
  return {
    accessToken: payload.tokens.accessToken,
    refreshToken: payload.tokens.refreshToken,
    user: payload.user,
  }
}

async function refreshAccessToken() {
  const refreshToken = useAuthStore.getState().refreshToken

  if (!refreshToken) {
    useAuthStore.getState().clearSession()
    return null
  }

  if (!refreshPromise) {
    refreshPromise = unauthenticatedClient
      .post<ApiResponse<AuthApiResponse>>('/api/v1/auth/refresh', { refreshToken })
      .then((response) => {
        const payload = unwrap<AuthApiResponse>(response)
        const authPayload = 'data' in payload ? payload.data : payload
        const session = normalizeAuthResponse(authPayload)
        useAuthStore.getState().setSession(session)
        return session.accessToken
      })
      .catch(() => {
        useAuthStore.getState().clearSession()
        return null
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

function attachAuth(config: InternalAxiosRequestConfig) {
  const accessToken = useAuthStore.getState().accessToken

  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`)
  }

  return config
}

apiClient.interceptors.request.use(attachAuth)

sessionClient.interceptors.request.use((config) => {
  const sessionToken = useJoinStore.getState().sessionToken

  if (sessionToken) {
    config.headers.set('X-Tournament-Session', sessionToken)
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true
    const nextAccessToken = await refreshAccessToken()

    if (!nextAccessToken) {
      return Promise.reject(error)
    }

    originalRequest.headers.set('Authorization', `Bearer ${nextAccessToken}`)
    return apiClient(originalRequest)
  },
)

export async function apiGet<T>(path: string, client: AxiosInstance = apiClient) {
  const response = await client.get<ApiResponse<T> | T>(path)
  const payload = unwrap<T>(response)
  return hasEnvelope(payload) ? payload.data : payload
}

export async function apiPost<TResponse, TBody>(
  path: string,
  body: TBody,
  client: AxiosInstance = apiClient,
) {
  const response = await client.post<ApiResponse<TResponse> | TResponse>(path, body)
  const payload = unwrap<TResponse>(response)
  return hasEnvelope(payload) ? payload.data : payload
}

export async function apiPut<TResponse, TBody>(
  path: string,
  body: TBody,
  client: AxiosInstance = apiClient,
) {
  const response = await client.put<ApiResponse<TResponse> | TResponse>(path, body)
  const payload = unwrap<TResponse>(response)
  return hasEnvelope(payload) ? payload.data : payload
}

export async function apiPatch<TResponse, TBody = undefined>(
  path: string,
  body?: TBody,
  client: AxiosInstance = apiClient,
) {
  const response = await client.patch<ApiResponse<TResponse> | TResponse>(path, body)
  const payload = unwrap<TResponse>(response)
  return hasEnvelope(payload) ? payload.data : payload
}

export async function apiDelete<TResponse>(
  path: string,
  client: AxiosInstance = apiClient,
) {
  const response = await client.delete<ApiResponse<TResponse> | TResponse>(path)
  const payload = unwrap<TResponse>(response)
  return hasEnvelope(payload) ? payload.data : payload
}
