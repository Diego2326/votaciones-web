import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useAuthStore } from '@/app/store/auth.store'
import { PageError } from '@/components/feedback/PageError'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Loader } from '@/components/ui/Loader'
import { toAppError } from '@/core/utils/errors'
import type { MatchResults, Participant, TournamentType } from '@/core/types/domain'
import { useTournamentAccess } from '@/features/join/hooks/useJoin'
import { buildQrImageUrl, buildTournamentQrJoinUrl } from '@/features/join/utils/qr'
import { useParticipants } from '@/features/participants/hooks/useParticipants'
import { useRounds } from '@/features/rounds/hooks/useRounds'
import { tournamentApi } from '@/features/tournaments/api/tournamentApi'
import { useTournament } from '@/features/tournaments/hooks/useTournament'
import { canManageTournament } from '@/features/tournaments/utils/ownership'
import { useTournamentLiveUpdates } from '@/features/websocket/hooks/useTournamentLiveUpdates'
import { useTournamentResults } from '@/features/votes/hooks/useVote'

interface LeaderboardEntry {
  participantId: string
  participantName: string
  votes: number
}

interface PresentationRound {
  id: string
  name: string
  roundNumber: number
  status: string
  matches: MatchResults[]
}

function getMatchTone(match: MatchResults) {
  if (match.status === 'RESOLVED') {
    return 'success'
  }

  if (match.status === 'OPEN') {
    return 'warning'
  }

  return 'neutral'
}

function buildLeaderboard(matches: MatchResults[]) {
  const board = new Map<string, LeaderboardEntry>()

  matches.forEach((match) => {
    match.results.forEach((entry) => {
      const current = board.get(entry.participantId)
      board.set(entry.participantId, {
        participantId: entry.participantId,
        participantName: entry.participantName,
        votes: (current?.votes ?? 0) + entry.votes,
      })
    })
  })

  return [...board.values()].sort((left, right) => right.votes - left.votes)
}

function getCurrentRound(rounds: PresentationRound[]) {
  return (
    rounds.find((round) => round.status === 'OPEN') ??
    rounds.find((round) => round.status === 'PROCESSING') ??
    rounds.find((round) => round.status === 'PENDING') ??
    rounds.find((round) => round.status === 'DRAFT') ??
    rounds.at(-1) ??
    null
  )
}

function MatchScoreCard({ match }: { match: MatchResults }) {
  const totalVotes = Math.max(
    match.totalVotes,
    match.results.reduce((accumulator, entry) => accumulator + entry.votes, 0),
  )

  return (
    <article className="presentation-match-card">
      <div className="split-line">
        <strong>Match {match.matchId.slice(0, 8)}</strong>
        <Badge tone={getMatchTone(match)}>{match.status}</Badge>
      </div>
      {match.results.length === 0 ? (
        <p className="label-muted">Sin resultados publicados.</p>
      ) : (
        <div className="stack">
          {match.results.map((entry) => {
            const percentage = totalVotes > 0 ? (entry.votes / totalVotes) * 100 : 0
            const isWinner = match.winnerId === entry.participantId

            return (
              <div
                key={entry.participantId}
                className={isWinner ? 'presentation-score-row is-winner' : 'presentation-score-row'}
              >
                <div className="split-line">
                  <span>{entry.participantName}</span>
                  <strong>{entry.votes}</strong>
                </div>
                <div className="presentation-score-track">
                  <span style={{ width: `${Math.max(percentage, totalVotes > 0 ? 8 : 0)}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </article>
  )
}

function PresentationLobbyStage({
  participants,
  currentRound,
}: {
  participants: Participant[]
  currentRound: PresentationRound | null
}) {
  const activeParticipants = participants.filter((participant) => participant.active)

  return (
    <section className="presentation-scene presentation-scene-lobby">
      <div className="presentation-scene-copy">
        <h2>Esperando a los participantes</h2>
        <div className="presentation-scene-meta">
          <div className="presentation-meta-pill">
            <span className="label-muted">Activos</span>
            <strong>{activeParticipants.length}</strong>
          </div>
          {currentRound ? (
            <div className="presentation-meta-pill">
              <span className="label-muted">Siguiente ronda</span>
              <strong>{currentRound.name}</strong>
            </div>
          ) : null}
        </div>
      </div>
      <div className="presentation-roster">
        {participants.length === 0 ? (
          <div className="presentation-empty-inline">
            Sin participantes.
          </div>
        ) : (
          participants.map((participant, index) => (
            <article
              key={participant.id}
              className={
                participant.active
                  ? 'presentation-roster-chip'
                  : 'presentation-roster-chip is-muted'
              }
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              <div className="presentation-participant-avatar">
                {participant.imageUrl ? (
                  <img src={participant.imageUrl} alt={participant.name} />
                ) : (
                  <span>{participant.name.slice(0, 1).toUpperCase()}</span>
                )}
              </div>
              <div className="stack stack-tight">
                <strong>{participant.name}</strong>
                <span className="label-muted">
                  {participant.active ? 'Conectando' : 'Inactivo'}
                </span>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

function PresentationLiveStage({
  type,
  currentRound,
  otherRounds,
  leaderboard,
}: {
  type: TournamentType
  currentRound: PresentationRound | null
  otherRounds: PresentationRound[]
  leaderboard: LeaderboardEntry[]
}) {
  if (!currentRound) {
    return (
      <section className="presentation-scene presentation-scene-live">
        <div className="presentation-empty-inline">
          Sin rondas disponibles.
        </div>
      </section>
    )
  }

  return (
    <section className="presentation-scene presentation-scene-live">
      <div className="presentation-live-header">
        <div>
          <h2>{currentRound.name}</h2>
        </div>
        <Badge tone={currentRound.status === 'OPEN' ? 'success' : 'warning'}>
          {currentRound.status}
        </Badge>
      </div>

      <div className="presentation-live-layout">
        <div className="presentation-live-main">
          {currentRound.matches.length === 0 ? (
            <div className="presentation-empty-inline">
              Sin cruces con resultados.
            </div>
          ) : (
            <div className="presentation-current-round-grid">
              {currentRound.matches.map((match) => (
                <MatchScoreCard key={match.matchId} match={match} />
              ))}
            </div>
          )}
        </div>

        <aside className="presentation-live-side">
          {type === 'POLL' || type === 'ROUND_BASED' ? (
            <div className="presentation-side-block">
              <div>
                <p className="eyebrow">Leaderboard</p>
                <h3>Marcador acumulado</h3>
              </div>
              {leaderboard.length === 0 ? (
                <p className="label-muted">Sin acumulado.</p>
              ) : (
                leaderboard.slice(0, 6).map((entry, index) => (
                  <div key={entry.participantId} className="presentation-leader-row">
                    <div className="presentation-rank-chip">{index + 1}</div>
                    <div className="stack stack-tight">
                      <strong>{entry.participantName}</strong>
                      <span className="label-muted">Total del torneo</span>
                    </div>
                    <strong>{entry.votes}</strong>
                  </div>
                ))
              )}
            </div>
          ) : null}
          <div className="presentation-side-block">
            <div>
              <p className="eyebrow">Radar del torneo</p>
              <h3>Mapa de rondas</h3>
            </div>
            <div className="presentation-round-timeline">
              <div className="presentation-timeline-item is-current">
                <div>
                  <strong>{currentRound.name}</strong>
                  <p className="label-muted">Ronda {currentRound.roundNumber}</p>
                </div>
                <Badge tone={currentRound.status === 'OPEN' ? 'success' : 'warning'}>
                  {currentRound.status}
                </Badge>
              </div>
              {otherRounds.map((round) => (
                <div key={round.id} className="presentation-timeline-item">
                  <div>
                    <strong>{round.name}</strong>
                    <p className="label-muted">Ronda {round.roundNumber}</p>
                  </div>
                  <Badge tone={round.status === 'PUBLISHED' ? 'success' : 'neutral'}>
                    {round.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

export function TournamentPresentationPage() {
  const { id = '' } = useParams()
  const user = useAuthStore((state) => state.user)
  const queryClient = useQueryClient()
  const tournamentQuery = useTournament(id)
  const accessQuery = useTournamentAccess(id)
  const participantsQuery = useParticipants(id)
  const roundsQuery = useRounds(id)
  const resultsQuery = useTournamentResults(id)
  const event = useTournamentLiveUpdates(id)

  const startTournamentMutation = useMutation({
    mutationFn: async () => {
      let nextTournament = tournamentQuery.data

      if (!nextTournament) {
        nextTournament = await tournamentApi.byId(id)
      }

      if (!nextTournament.published) {
        nextTournament = await tournamentApi.publish(id)
      }

      if (!nextTournament.active) {
        nextTournament = await tournamentApi.activate(id)
      }

      return nextTournament
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tournaments', id] })
      void queryClient.invalidateQueries({ queryKey: ['tournaments', id, 'access'] })
      void queryClient.invalidateQueries({ queryKey: ['participants', id] })
      void queryClient.invalidateQueries({ queryKey: ['rounds', id] })
      void queryClient.invalidateQueries({ queryKey: ['vote', 'tournament-results', id] })
    },
  })

  useEffect(() => {
    if (!event) {
      return
    }

    void queryClient.invalidateQueries({ queryKey: ['tournaments', id] })
    void queryClient.invalidateQueries({ queryKey: ['tournaments', id, 'access'] })
    void queryClient.invalidateQueries({ queryKey: ['participants', id] })
    void queryClient.invalidateQueries({ queryKey: ['rounds', id] })
    void queryClient.invalidateQueries({ queryKey: ['vote', 'tournament-results', id] })
  }, [event, id, queryClient])

  if (
    tournamentQuery.isLoading ||
    accessQuery.isLoading ||
    participantsQuery.isLoading ||
    roundsQuery.isLoading ||
    resultsQuery.isLoading
  ) {
    return <Loader label="Preparando presentacion..." />
  }

  if (
    tournamentQuery.isError ||
    accessQuery.isError ||
    participantsQuery.isError ||
    roundsQuery.isError ||
    resultsQuery.isError ||
    !tournamentQuery.data ||
    !accessQuery.data
  ) {
    return (
      <PageError
        message={
          toAppError(
            tournamentQuery.error ??
              accessQuery.error ??
              participantsQuery.error ??
              roundsQuery.error ??
              resultsQuery.error,
          ).message
        }
      />
    )
  }

  const tournament = tournamentQuery.data

  if (!canManageTournament(user, tournament)) {
    return (
      <PageError
        title="No puedes presentar este torneo"
        message="Los organizadores solo pueden abrir la presentacion de torneos propios."
      />
    )
  }

  const access = accessQuery.data
  const participants = participantsQuery.data ?? []
  const rounds = roundsQuery.data ?? []
  const resultRounds = resultsQuery.data?.rounds ?? []
  const resultRoundsMap = new Map(resultRounds.map((round) => [round.roundId, round]))
  const sortedRounds = [...rounds]
    .sort((left, right) => left.roundNumber - right.roundNumber)
    .map((round) => ({
      id: round.id,
      name: round.name,
      roundNumber: round.roundNumber,
      status: round.status,
      matches: resultRoundsMap.get(round.id)?.matches ?? [],
    }))
  const currentRound = getCurrentRound(sortedRounds)
  const otherRounds = sortedRounds.filter((round) => round.id !== currentRound?.id)
  const allMatches = sortedRounds.flatMap((round) => round.matches)
  const leaderboard = buildLeaderboard(allMatches)
  const frontendJoinUrl = buildTournamentQrJoinUrl(access.qrToken)
  const qrImageUrl = buildQrImageUrl(frontendJoinUrl, '220x220')

  return (
    <div className="presentation-shell">
      <section className="presentation-modal">
        <header className="presentation-topbar">
          <div className="presentation-title-block">
            <div className="presentation-topline">
              <Badge tone={tournament.active ? 'success' : 'warning'}>{tournament.status}</Badge>
              {event ? (
                <span className="presentation-live-pill">
                  <span className="presentation-live-dot" />
                  {event.type}
                </span>
              ) : null}
            </div>
            <h1>{tournament.name}</h1>
            {tournament.description ? <p className="presentation-copy">{tournament.description}</p> : null}
          </div>

          <div className="presentation-access-panel">
            <div className="presentation-code-block">
              <span className="metric-label">Codigo</span>
              <strong>{access.joinPin}</strong>
            </div>

            <a
              className="presentation-qr-inline"
              href={frontendJoinUrl}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={qrImageUrl}
                alt={`QR de acceso para ${tournament.name}`}
                width={132}
                height={132}
              />
            </a>

            {!tournament.active ? (
              <Button
                className="presentation-start-button"
                onClick={() => startTournamentMutation.mutate()}
                disabled={startTournamentMutation.isPending}
              >
                {startTournamentMutation.isPending ? 'Iniciando...' : 'Iniciar'}
              </Button>
            ) : null}
          </div>
        </header>

        <div className="presentation-body">
          {startTournamentMutation.isError ? (
            <PageError
              title="No se pudo iniciar el torneo"
              message={toAppError(startTournamentMutation.error).message}
            />
          ) : null}
          {!tournament.active ? (
            <PresentationLobbyStage
              participants={participants}
              currentRound={currentRound}
            />
          ) : (
            <PresentationLiveStage
              type={tournament.type}
              currentRound={currentRound}
              otherRounds={otherRounds}
              leaderboard={leaderboard}
            />
          )}
        </div>
      </section>
    </div>
  )
}
