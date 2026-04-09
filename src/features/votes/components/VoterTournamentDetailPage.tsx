import { Link, useParams } from 'react-router-dom'

import { EmptyState } from '@/components/feedback/EmptyState'
import { PageError } from '@/components/feedback/PageError'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { toAppError } from '@/core/utils/errors'
import { useRounds } from '@/features/rounds/hooks/useRounds'
import { useTournament } from '@/features/tournaments/hooks/useTournament'

export function VoterTournamentDetailPage() {
  const { id = '' } = useParams()
  const tournamentQuery = useTournament(id)
  const roundsQuery = useRounds(id)

  if (tournamentQuery.isLoading || roundsQuery.isLoading) {
    return <Loader label="Cargando torneo..." />
  }

  if (tournamentQuery.isError || roundsQuery.isError || !tournamentQuery.data) {
    return <PageError message={toAppError(tournamentQuery.error ?? roundsQuery.error).message} />
  }

  const tournament = tournamentQuery.data
  const rounds = roundsQuery.data ?? []

  return (
    <div className="stack">
      <Card className="arena-hero-card">
        <div className="split-line">
          <div className="stack">
            <p className="eyebrow">Arena seleccionada</p>
            <h1>{tournament.name}</h1>
            <p className="arena-copy">
              {tournament.description || 'Elige una ronda y entra al siguiente combate disponible.'}
            </p>
          </div>
          <Badge tone={tournament.active ? 'success' : 'warning'}>{tournament.status}</Badge>
        </div>
      </Card>
      {rounds.length === 0 ? (
        <Card className="arena-mode-card">
          <EmptyState
            title="Sin rondas"
            description="El organizador aun no ha publicado rondas para este torneo."
          />
        </Card>
      ) : (
        <div className="card-grid">
          {rounds.map((round) => (
            <Card key={round.id} className="arena-round-card">
              <div className="stack">
                <div className="split-line">
                  <div>
                    <p className="eyebrow">Nivel {round.roundNumber}</p>
                    <h2>{round.name}</h2>
                  </div>
                  <Badge tone={round.status === 'OPEN' ? 'success' : 'neutral'}>{round.status}</Badge>
                </div>
                <p className="label-muted">
                  {round.opensAt ? `Abre ${new Date(round.opensAt).toLocaleString()}` : 'Sin hora de apertura'}
                </p>
                <Link to={`/vote/rounds/${round.id}`}>
                  <Button fullWidth>Entrar a la ronda</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
