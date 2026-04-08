import axios from 'axios'

import type { ApiErrorResponse } from '@/core/types/api'

export class AppError extends Error {
  readonly status: number | undefined
  readonly payload: ApiErrorResponse | undefined

  constructor(
    message: string,
    status?: number,
    payload?: ApiErrorResponse,
  ) {
    super(message)
    this.name = 'AppError'
    this.status = status
    this.payload = payload
  }
}

export function toAppError(error: unknown) {
  if (error instanceof AppError) {
    return error
  }

  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return new AppError(
      error.response?.data.message ?? error.message,
      error.response?.status,
      error.response?.data,
    )
  }

  if (error instanceof Error) {
    return new AppError(error.message)
  }

  return new AppError('Ocurrio un error inesperado')
}
