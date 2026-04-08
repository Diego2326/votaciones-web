import type { ApiErrorResponse, ApiResponse } from '../types/api'
import { readStorage } from '../lib/storage'

export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.toString() ?? 'http://localhost:8080'
export const TOKEN_STORAGE_KEY = 'organizer.accessToken'
export const SESSION_HEADER = 'X-Tournament-Session'

interface RequestOptions extends RequestInit {
  token?: string
  sessionToken?: string
}

export function buildSessionHeaders(sessionToken: string) {
  return {
    [SESSION_HEADER]: sessionToken,
  }
}

function buildHeaders(options: RequestOptions) {
  const headers = new Headers(options.headers)

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`)
  }

  if (options.sessionToken) {
    headers.set(SESSION_HEADER, options.sessionToken)
  }

  return headers
}

async function parseJson<T>(response: Response) {
  const payload = (await response.json()) as ApiResponse<T> | ApiErrorResponse

  if (!response.ok) {
    throw payload
  }

  return payload as ApiResponse<T>
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(options),
  })

  return parseJson<T>(response)
}

export async function authorizedRequest<T>(
  path: string,
  options: RequestOptions = {},
) {
  return apiRequest<T>(path, {
    ...options,
    token: options.token ?? readStorage(TOKEN_STORAGE_KEY) ?? undefined,
  })
}

export async function sessionRequest<T>(
  path: string,
  options: RequestOptions & { sessionToken: string },
) {
  return apiRequest<T>(path, options)
}
