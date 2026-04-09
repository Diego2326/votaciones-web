import type { PaginatedResponse } from '@/core/types/api'

export function mapCollection<TInput, TOutput>(
  payload: TInput[] | PaginatedResponse<TInput>,
  mapper: (value: TInput) => TOutput,
) {
  if (Array.isArray(payload)) {
    return payload.map(mapper)
  }

  if (Array.isArray(payload.content)) {
    return payload.content.map(mapper)
  }

  return []
}
