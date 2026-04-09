import type { Match, Participant } from '@/core/types/domain'
import type { MatchPayload } from '@/features/matches/types/match.types'

interface EliminationAutoMatchPlan {
  payload?: MatchPayload
  message?: string
}

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

function pickTwoRandomDistinct(participantIds: string[]) {
  const firstId = pickRandom(participantIds)
  const remainingIds = participantIds.filter((id) => id !== firstId)
  const secondId = pickRandom(remainingIds)

  return [firstId, secondId] as const
}

function getMatchTimestamp(match: Match) {
  if (!match.createdAt) {
    return 0
  }

  const timestamp = Date.parse(match.createdAt)
  return Number.isNaN(timestamp) ? 0 : timestamp
}

function getLatestWinnerId(matches: Match[]) {
  const resolvedMatches = matches
    .filter((match) => match.winnerId)
    .sort((a, b) => getMatchTimestamp(a) - getMatchTimestamp(b))

  return resolvedMatches.at(-1)?.winnerId ?? null
}

function buildManualMatchPayload(participantAId: string, participantBId: string): MatchPayload {
  return {
    matches: [{ participantAId, participantBId }],
  }
}

export function buildEliminationAutoMatchPlan({
  participants,
  matches,
}: {
  participants: Participant[]
  matches: Match[]
}): EliminationAutoMatchPlan {
  const activeParticipantIds = participants.filter((participant) => participant.active).map((participant) => participant.id)

  if (activeParticipantIds.length < 2) {
    return {
      message: 'Se necesitan al menos 2 participantes activos para generar un duelo.',
    }
  }

  const hasPendingMatch = matches.some((match) => !match.winnerId)

  if (hasPendingMatch) {
    return {
      message: 'Primero define el ganador del match pendiente antes de generar el siguiente.',
    }
  }

  const eliminatedParticipantIds = new Set<string>()

  matches.forEach((match) => {
    if (!match.winnerId || !match.participantAId || !match.participantBId) {
      return
    }

    const loserId = match.winnerId === match.participantAId ? match.participantBId : match.participantAId
    eliminatedParticipantIds.add(loserId)
  })

  const remainingParticipantIds = activeParticipantIds.filter((id) => !eliminatedParticipantIds.has(id))

  if (remainingParticipantIds.length < 2) {
    return {
      message: 'Ya no hay suficientes participantes disponibles para otro duelo.',
    }
  }

  if (matches.length === 0) {
    const [participantAId, participantBId] = pickTwoRandomDistinct(remainingParticipantIds)

    return {
      payload: buildManualMatchPayload(participantAId, participantBId),
    }
  }

  const currentWinnerId = getLatestWinnerId(matches)

  if (!currentWinnerId || !remainingParticipantIds.includes(currentWinnerId)) {
    const [participantAId, participantBId] = pickTwoRandomDistinct(remainingParticipantIds)

    return {
      payload: buildManualMatchPayload(participantAId, participantBId),
    }
  }

  const opponentCandidates = remainingParticipantIds.filter((id) => id !== currentWinnerId)

  if (opponentCandidates.length === 0) {
    return {
      message: 'No hay rivales disponibles para continuar la eliminacion.',
    }
  }

  return {
    payload: buildManualMatchPayload(currentWinnerId, pickRandom(opponentCandidates)),
  }
}
