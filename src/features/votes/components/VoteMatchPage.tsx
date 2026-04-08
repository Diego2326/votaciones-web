import { useParams } from 'react-router-dom'

import { EmptyState } from '@/components/feedback/EmptyState'
import { PageError } from '@/components/feedback/PageError'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { toAppError } from '@/core/utils/errors'
import { useMatchVote, useMyVote, useVote } from '@/features/votes/hooks/useVote'

export function VoteMatchPage() {
  const { id = '' } = useParams()
  const matchQuery = useMatchVote(id)
  const myVoteQuery = useMyVote(id)
  const voteMutation = useVote(id)

  if (matchQuery.isLoading || myVoteQuery.isLoading) {
    return <Loader label="Preparando votacion..." />
  }

  if (matchQuery.isError) {
    return <PageError message={toAppError(matchQuery.error).message} />
  }

  if (!matchQuery.data) {
    return (
      <Card>
        <EmptyState
          title="Match no encontrado"
          description="Verifica que la ronda siga activa."
        />
      </Card>
    )
  }

  const match = matchQuery.data
  const myVote = myVoteQuery.data

  return (
    <Card>
      <div className="stack">
        <div className="page-header">
          <div>
            <p className="eyebrow">Votacion</p>
            <h1>
              {match.participantAName ?? 'Pendiente'} vs {match.participantBName ?? 'Pendiente'}
            </h1>
          </div>
          {myVote?.hasVoted ? <Badge tone="success">Ya votaste</Badge> : null}
        </div>
        <div className="detail-grid">
          <Button
            disabled={Boolean(myVote?.hasVoted)}
            onClick={() =>
              match.participantAId &&
              voteMutation.mutate({ participantId: match.participantAId })
            }
          >
            Votar por {match.participantAName ?? 'Participante A'}
          </Button>
          <Button
            variant="secondary"
            disabled={Boolean(myVote?.hasVoted)}
            onClick={() =>
              match.participantBId &&
              voteMutation.mutate({ participantId: match.participantBId })
            }
          >
            Votar por {match.participantBName ?? 'Participante B'}
          </Button>
        </div>
      </div>
    </Card>
  )
}
