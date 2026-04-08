import { Link, useSearchParams } from 'react-router-dom'

import { EmptyState } from '@/components/feedback/EmptyState'
import { PageError } from '@/components/feedback/PageError'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { formatTournamentCode, normalizeTournamentCode } from '@/core/utils/tournamentCode'
import { toAppError } from '@/core/utils/errors'
import { useVoterTournaments } from '@/features/votes/hooks/useVote'

export function VoterTournamentListPage() {
  const tournamentsQuery = useVoterTournaments()
  const [searchParams] = useSearchParams()
  const searchCode = normalizeTournamentCode(searchParams.get('code') ?? '')

  if (tournamentsQuery.isLoading) {
    return <Loader label="Cargando torneos abiertos..." />
  }

  if (tournamentsQuery.isError) {
    return <PageError message={toAppError(tournamentsQuery.error).message} />
  }

  const tournaments = (tournamentsQuery.data ?? []).filter((tournament) => {
    if (!searchCode) {
      return true
    }

    return (
      tournament.name.toLowerCase().includes(searchCode) ||
      tournament.id.toLowerCase().includes(searchCode)
    )
  })

  return (
    <div className="stack">
      {searchCode ? (
        <p className="label-muted">
          Codigo recibido: {formatTournamentCode(searchCode)}
        </p>
      ) : null}
      <div className="card-grid">
      {tournaments.length === 0 ? (
        <Card>
          <EmptyState
            title="No hay torneos disponibles"
            description="Vuelve mas tarde cuando un organizador publique nuevas rondas."
          />
        </Card>
      ) : (
        tournaments.map((tournament) => (
          <Card key={tournament.id}>
            <div className="stack">
              <div>
                <p className="eyebrow">Torneo</p>
                <h2>{tournament.name}</h2>
                <p>{tournament.description}</p>
              </div>
              <Link to={`/vote/tournaments/${tournament.id}`}>
                <Button>Entrar</Button>
              </Link>
            </div>
          </Card>
        ))
      )}
      </div>
    </div>
  )
}
