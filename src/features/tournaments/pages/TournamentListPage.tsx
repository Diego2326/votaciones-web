import { Link } from 'react-router-dom'

import { EmptyState } from '@/components/feedback/EmptyState'
import { PageError } from '@/components/feedback/PageError'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { ROUTES } from '@/core/constants/routes'
import { toAppError } from '@/core/utils/errors'
import { TournamentTable } from '@/features/tournaments/components/TournamentTable'
import { useTournaments } from '@/features/tournaments/hooks/useTournaments'

export function TournamentListPage() {
  const tournamentsQuery = useTournaments()

  if (tournamentsQuery.isLoading) {
    return <Loader label="Cargando torneos..." />
  }

  if (tournamentsQuery.isError) {
    return <PageError message={toAppError(tournamentsQuery.error).message} />
  }

  const tournaments = tournamentsQuery.data ?? []

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Organizacion</p>
          <h1>Torneos</h1>
        </div>
        <Link to={ROUTES.tournamentsNew}>
          <Button>Crear torneo</Button>
        </Link>
      </div>
      <Card>
        {tournaments.length === 0 ? (
          <EmptyState
            title="Aun no hay torneos"
            description="Crea el primero para empezar a administrar rondas, participantes y votos."
          />
        ) : (
          <TournamentTable tournaments={tournaments} />
        )}
      </Card>
    </div>
  )
}
