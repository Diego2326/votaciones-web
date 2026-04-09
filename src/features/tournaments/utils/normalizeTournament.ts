import type { PaginatedResponse } from '@/core/types/api'
import { mapCollection } from '@/core/utils/collections'
import type {
  Tournament,
  TournamentAccessMode,
  TournamentCreator,
  TournamentStatus,
  TournamentType,
} from '@/core/types/domain'

export interface ApiTournament
  extends Omit<
    Tournament,
    | 'name'
    | 'title'
    | 'type'
    | 'accessMode'
    | 'description'
    | 'startAt'
    | 'endAt'
    | 'published'
    | 'active'
    | 'organizerId'
    | 'createdBy'
  > {
  name?: string | null
  title?: string | null
  type?: TournamentType | null
  description?: string | null
  accessMode?: TournamentAccessMode | null
  createdBy?: TournamentCreator | null
  startAt?: string | null
  endAt?: string | null
  status: TournamentStatus
}

export function normalizeTournament(tournament: ApiTournament): Tournament {
  const { type, ...rest } = tournament
  const resolvedTitle = tournament.title?.trim() || tournament.name?.trim() || ''
  const isPublished = ['PUBLISHED', 'ACTIVE', 'PAUSED', 'CLOSED', 'FINISHED'].includes(
    tournament.status,
  )

  return {
    ...rest,
    name: tournament.name?.trim() || resolvedTitle,
    title: resolvedTitle,
    description: tournament.description ?? null,
    type: type ?? 'POLL',
    accessMode: tournament.accessMode ?? 'ANONYMOUS',
    published: isPublished,
    active: tournament.status === 'ACTIVE',
    startAt: tournament.startAt ?? null,
    endAt: tournament.endAt ?? null,
    ...(tournament.createdBy?.id ? { organizerId: tournament.createdBy.id } : {}),
  }
}

export function normalizeTournamentCollection(
  payload: ApiTournament[] | PaginatedResponse<ApiTournament>,
) {
  return mapCollection(payload, normalizeTournament)
}
