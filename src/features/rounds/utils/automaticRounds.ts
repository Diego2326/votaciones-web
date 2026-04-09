import type { Tournament } from '@/core/types/domain'
import type { RoundPayload } from '@/features/rounds/types/round.types'

export interface AutomaticRoundPlan {
  rounds: RoundPayload[]
  note: string
  requirementMessage?: string
}

const BRACKET_STAGE_NAMES: Record<number, string> = {
  1: 'Final',
  2: 'Semifinal',
  3: 'Cuartos de final',
  4: 'Octavos de final',
  5: 'Dieciseisavos de final',
  6: 'Treintaidosavos de final',
}

function withDistributedSchedule(
  rounds: RoundPayload[],
  startAt?: string | null,
  endAt?: string | null,
) {
  if (!rounds.length) {
    return rounds
  }

  if (!startAt) {
    return rounds
  }

  const startMs = new Date(startAt).getTime()

  if (Number.isNaN(startMs)) {
    return rounds
  }

  const endMs = endAt ? new Date(endAt).getTime() : Number.NaN

  if (!Number.isNaN(endMs) && endMs > startMs) {
    const slice = (endMs - startMs) / rounds.length

    return rounds.map((round, index) => ({
      ...round,
      opensAt: new Date(startMs + slice * index).toISOString(),
      closesAt: new Date(index === rounds.length - 1 ? endMs : startMs + slice * (index + 1)).toISOString(),
    }))
  }

  return rounds.map((round, index) =>
    index === 0
      ? {
          ...round,
          opensAt: new Date(startMs).toISOString(),
        }
      : round,
  )
}

function getBracketRoundName(totalRounds: number, roundNumber: number) {
  const stageFromEnd = totalRounds - roundNumber + 1

  return BRACKET_STAGE_NAMES[stageFromEnd] ?? `Ronda ${roundNumber}`
}

function buildEliminationRounds(participantCount: number) {
  if (participantCount < 2) {
    return {
      rounds: [],
      note: 'Los torneos de eliminacion y bracket necesitan una llave real para calcular fases.',
      requirementMessage: 'Necesitas al menos 2 participantes activos para generar la estructura.',
    } satisfies AutomaticRoundPlan
  }

  const totalRounds = Math.ceil(Math.log2(participantCount))
  const rounds = Array.from({ length: totalRounds }, (_, index) => {
    const roundNumber = index + 1

    return {
      name: getBracketRoundName(totalRounds, roundNumber),
      roundNumber,
    }
  })

  return {
    rounds,
    note: `Se calcularon ${totalRounds} rondas segun ${participantCount} participantes activos.`,
  } satisfies AutomaticRoundPlan
}

export function buildAutomaticRoundPlan(
  tournament: Pick<Tournament, 'type' | 'startAt' | 'endAt'>,
  participantCount: number,
): AutomaticRoundPlan {
  switch (tournament.type) {
    case 'POLL':
      return {
        rounds: withDistributedSchedule(
          [
            {
              name: 'Votacion general',
              roundNumber: 1,
            },
          ],
          tournament.startAt,
          tournament.endAt,
        ),
        note: 'Los torneos de votacion usan una sola ronda base para concentrar todo el flujo.',
      }

    case 'ROUND_BASED':
      return {
        rounds: withDistributedSchedule(
          [
            { name: 'Jornada 1', roundNumber: 1 },
            { name: 'Jornada 2', roundNumber: 2 },
            { name: 'Jornada 3', roundNumber: 3 },
          ],
          tournament.startAt,
          tournament.endAt,
        ),
        note: 'Los torneos por rondas arrancan con una secuencia base de 3 jornadas.',
      }

    case 'ELIMINATION':
    case 'BRACKET': {
      const plan = buildEliminationRounds(participantCount)

      return {
        ...plan,
        rounds: withDistributedSchedule(plan.rounds, tournament.startAt, tournament.endAt),
      }
    }
  }
}
