export interface ApiResponse<T> {
  data: T
  message?: string
  timestamp?: string
}

export interface ApiErrorResponse {
  status?: number
  error?: string
  message: string
  path?: string
  timestamp?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}
