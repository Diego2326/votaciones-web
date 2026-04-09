import { useParams } from 'react-router-dom'

import { useJoinStore } from '@/app/store/join.store'
import { EmptyState } from '@/components/feedback/EmptyState'
import { PageError } from '@/components/feedback/PageError'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { toAppError } from '@/core/utils/errors'
import { useMatchResults, useMatchVote, useMyVote, useVote } from '@/features/votes/hooks/useVote'

export function VoteMatchPage() {
  const { id = '' } = useParams()
  const sessionToken = useJoinStore((state) => state.sessionToken)
  const matchQuery = useMatchVote(id)
  const myVoteQuery = useMyVote(id)
  const resultsQuery = useMatchResults(id)
  const voteMutation = useVote(id)

  if (matchQuery.isLoading || myVoteQuery.isLoading || resultsQuery.isLoading) {
    return <Loader label="Preparando votacion..." />
  }

  if (matchQuery.isError) {
    return <PageError message={toAppError(matchQuery.error).message} />
  }

  if (!matchQuery.data) {
    return (
      <Card>
        <EmptyState title="Match no encontrado" description="No disponible." />
      </Card>
    )
  }

  const match = matchQuery.data
  const myVote = myVoteQuery.data
  const results = resultsQuery.data
  const canVote = Boolean(sessionToken) && !myVote?.hasVoted && match.status === 'OPEN'
  const totalVotes = Math.max(
    results?.totalVotes ?? 0,
    results?.results.reduce((accumulator, entry) => accumulator + entry.votes, 0) ?? 0,
  )
  const selectedParticipantId = myVote?.selectedParticipantId ?? myVote?.participantId ?? null

  return (
    <div className="stack">
      <Card className="arena-duel-card">
        <div className="split-line">
          <div>
            <p className="eyebrow">Duelo activo</p>
            <h1>
              {match.participantAName ?? 'Pendiente'} vs {match.participantBName ?? 'Pendiente'}
            </h1>
          </div>
          {myVote?.hasVoted ? <Badge tone="success">Ya jugaste</Badge> : <Badge tone="warning">{match.status}</Badge>}
        </div>
        {!sessionToken ? (
          <PageError message="Necesitas una sesion activa del torneo para votar." />
        ) : null}
        <div className="arena-duel-grid">
          {[
            {
              id: match.participantAId,
              name: match.participantAName ?? 'Participante A',
              imageUrl: match.participantA?.imageUrl ?? null,
              variant: 'primary' as const,
            },
            {
              id: match.participantBId,
              name: match.participantBName ?? 'Participante B',
              imageUrl: match.participantB?.imageUrl ?? null,
              variant: 'secondary' as const,
            },
          ].map((fighter) => {
            const resultEntry = results?.results.find((entry) => entry.participantId === fighter.id)
            const votes = resultEntry?.votes ?? 0
            const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0
            const isSelected = selectedParticipantId === fighter.id
            const isWinner = results?.winnerId === fighter.id

            return (
              <article
                key={fighter.id ?? fighter.name}
                className={
                  isSelected ? 'arena-fighter-card is-selected' : 'arena-fighter-card'
                }
              >
                <div className="arena-fighter-portrait">
                  {fighter.imageUrl ? (
                    <img src={fighter.imageUrl} alt={fighter.name} />
                  ) : (
                    <span>{fighter.name.slice(0, 1).toUpperCase()}</span>
                  )}
                </div>
                <div className="stack">
                  <div className="split-line">
                    <strong>{fighter.name}</strong>
                    {isWinner ? <Badge tone="success">Ganando</Badge> : null}
                  </div>
                  <div className="presentation-score-track arena-score-track">
                    <span style={{ width: `${Math.max(percentage, totalVotes > 0 ? 10 : 0)}%` }} />
                  </div>
                  <div className="split-line">
                    <span className="label-muted">{votes} votos</span>
                    <span className="label-muted">{percentage.toFixed(0)}%</span>
                  </div>
                  <Button
                    variant={fighter.variant}
                    disabled={!canVote || !fighter.id || voteMutation.isPending}
                    onClick={() =>
                      fighter.id &&
                      voteMutation.mutate({ selectedParticipantId: fighter.id })
                    }
                  >
                    {myVote?.hasVoted && isSelected
                      ? 'Tu decision'
                      : `Votar por ${fighter.name}`}
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      </Card>

      {results ? (
        <Card className="presentation-panel-card">
          <div className="stack">
            <div className="page-header">
              <div>
                <p className="eyebrow">Marcador</p>
                <h2>Resultados del duelo</h2>
              </div>
              <strong>{results.totalVotes} votos</strong>
            </div>
            {results.results.map((entry) => {
              const percentage = totalVotes > 0 ? (entry.votes / totalVotes) * 100 : 0

              return (
                <div key={entry.participantId} className="presentation-score-row">
                  <div className="split-line">
                    <span>{entry.participantName}</span>
                    <strong>{entry.votes}</strong>
                  </div>
                  <div className="presentation-score-track">
                    <span style={{ width: `${Math.max(percentage, totalVotes > 0 ? 10 : 0)}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      ) : null}
    </div>
  )
}
