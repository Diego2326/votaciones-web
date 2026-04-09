import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import { PageError } from '@/components/feedback/PageError'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { ROUTES } from '@/core/constants/routes'
import { toAppError } from '@/core/utils/errors'
import type { MatchResults, TournamentType } from '@/core/types/domain'
import { useRounds } from '@/features/rounds/hooks/useRounds'
import { useTournament } from '@/features/tournaments/hooks/useTournament'
import { useTournamentLiveUpdates } from '@/features/websocket/hooks/useTournamentLiveUpdates'
import { useTournamentResults } from '@/features/votes/hooks/useVote'

interface LeaderboardEntry {
  participantId: string
  participantName: string
  votes: number
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
        <p className="label-muted">Aun no hay votos o resultados publicados.</p>
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

function PresentationStage({
  type,
  rounds,
  leaderboard,
}: {
  type: TournamentType
  rounds: Array<{
    id: string
    name: string
    roundNumber: number
    status: string
    matches: MatchResults[]
  }>
  leaderboard: LeaderboardEntry[]
}) {
  if (type === 'ELIMINATION' || type === 'BRACKET') {
    return (
      <div className="presentation-bracket">
        {rounds.map((round) => (
          <section key={round.id} className="presentation-round-column">
            <div className="presentation-round-header">
              <p className="eyebrow">Ronda {round.roundNumber}</p>
              <h2>{round.name}</h2>
              <Badge tone={round.status === 'OPEN' ? 'success' : 'neutral'}>{round.status}</Badge>
            </div>
            <div className="presentation-round-stack">
              {round.matches.length === 0 ? (
                <Card className="presentation-muted-card">
                  <p className="label-muted">Sin cruces resueltos todavia.</p>
                </Card>
              ) : (
                round.matches.map((match) => <MatchScoreCard key={match.matchId} match={match} />)
              )}
            </div>
          </section>
        ))}
      </div>
    )
  }

  return (
    <div className="detail-grid">
      <Card className="presentation-panel-card">
        <div className="stack">
          <div>
            <p className="eyebrow">Leaderboard</p>
            <h2>Marcador general</h2>
          </div>
          {leaderboard.length === 0 ? (
            <p className="label-muted">Aun no hay votos agregados para mostrar posiciones.</p>
          ) : (
            leaderboard.map((entry, index) => (
              <div key={entry.participantId} className="presentation-leader-row">
                <div className="presentation-rank-chip">{index + 1}</div>
                <div className="stack stack-tight">
                  <strong>{entry.participantName}</strong>
                  <span className="label-muted">Acumulado del torneo</span>
                </div>
                <strong>{entry.votes} votos</strong>
              </div>
            ))
          )}
        </div>
      </Card>
      <Card className="presentation-panel-card">
        <div className="stack">
          <div>
            <p className="eyebrow">Rondas</p>
            <h2>Desglose por etapa</h2>
          </div>
          {rounds.map((round) => (
            <section key={round.id} className="presentation-round-block">
              <div className="split-line">
                <div>
                  <strong>{round.name}</strong>
                  <p className="label-muted">Ronda {round.roundNumber}</p>
                </div>
                <Badge tone={round.status === 'OPEN' ? 'success' : 'neutral'}>{round.status}</Badge>
              </div>
              <div className="stack">
                {round.matches.length === 0 ? (
                  <p className="label-muted">Sin resultados publicados en esta ronda.</p>
                ) : (
                  round.matches.map((match) => <MatchScoreCard key={match.matchId} match={match} />)
                )}
              </div>
            </section>
          ))}
        </div>
      </Card>
    </div>
  )
}

export function TournamentPresentationPage() {
  const { id = '' } = useParams()
  const queryClient = useQueryClient()
  const tournamentQuery = useTournament(id)
  const roundsQuery = useRounds(id)
  const resultsQuery = useTournamentResults(id)
  const event = useTournamentLiveUpdates(id)

  useEffect(() => {
    if (!event) {
      return
    }

    void queryClient.invalidateQueries({ queryKey: ['tournaments', id] })
    void queryClient.invalidateQueries({ queryKey: ['rounds', id] })
    void queryClient.invalidateQueries({ queryKey: ['vote', 'tournament-results', id] })
  }, [event, id, queryClient])

  if (tournamentQuery.isLoading || roundsQuery.isLoading || resultsQuery.isLoading) {
    return <Loader label="Preparando presentacion..." />
  }

  if (tournamentQuery.isError || roundsQuery.isError || resultsQuery.isError || !tournamentQuery.data) {
    return (
      <PageError
        message={toAppError(tournamentQuery.error ?? roundsQuery.error ?? resultsQuery.error).message}
      />
    )
  }

  const tournament = tournamentQuery.data
  const rounds = roundsQuery.data ?? []
  const resultRounds = resultsQuery.data?.rounds ?? []
  const resultRoundsMap = new Map(resultRounds.map((round) => [round.roundId, round]))
  const presentationRounds = rounds.map((round) => ({
    id: round.id,
    name: round.name,
    roundNumber: round.roundNumber,
    status: round.status,
    matches: resultRoundsMap.get(round.id)?.matches ?? [],
  }))
  const allMatches = presentationRounds.flatMap((round) => round.matches)
  const leaderboard = buildLeaderboard(allMatches)
  const totalVotes = allMatches.reduce((accumulator, match) => accumulator + match.totalVotes, 0)

  return (
    <div className="presentation-shell">
      <header className="presentation-hero">
        <div className="stack">
          <div className="presentation-topline">
            <p className="eyebrow">Modo presentacion</p>
            <Badge tone={tournament.active ? 'success' : 'warning'}>{tournament.status}</Badge>
          </div>
          <h1>{tournament.name}</h1>
          <p className="presentation-copy">
            {tournament.description || 'Vista pensada para mostrar enfrentamientos y resultados en sala.'}
          </p>
        </div>
        <div className="presentation-actions">
          <div className="presentation-stat">
            <span className="metric-label">Tipo</span>
            <strong>{tournament.type}</strong>
          </div>
          <div className="presentation-stat">
            <span className="metric-label">Rondas</span>
            <strong>{presentationRounds.length}</strong>
          </div>
          <div className="presentation-stat">
            <span className="metric-label">Votos</span>
            <strong>{totalVotes}</strong>
          </div>
          <Link to={ROUTES.tournamentDetail.replace(':id', id)}>
            <Button variant="secondary">Volver al workspace</Button>
          </Link>
        </div>
      </header>

      <div className="presentation-banner">
        <span className="presentation-live-dot" />
        {event
          ? `Actualizacion en vivo: ${event.type} · ${new Date(event.emittedAt).toLocaleTimeString()}`
          : 'Esperando eventos en vivo del torneo'}
      </div>

      <PresentationStage
        type={tournament.type}
        rounds={presentationRounds}
        leaderboard={leaderboard}
      />
    </div>
  )
}
