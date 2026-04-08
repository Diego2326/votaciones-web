import { useAuthStore } from '@/app/store/auth.store'
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
import { getTournamentCollections } from '@/features/tournaments/utils/tournamentCollections'

export function TournamentListPage() {
  const user = useAuthStore((state) => state.user)
  const tournamentsQuery = useTournaments()

  if (tournamentsQuery.isLoading) {
    return <Loader label="Cargando torneos..." />
  }

  if (tournamentsQuery.isError) {
    return <PageError message={toAppError(tournamentsQuery.error).message} />
  }

  const tournaments = tournamentsQuery.data ?? []
  const collections = getTournamentCollections(tournaments, user)
  const myTournaments = collections.mine
  const otherTournaments = collections.others

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Organizacion</p>
          <h1>Mis torneos</h1>
          <p>
            {collections.hasOwnershipData
              ? 'Esta lista muestra los torneos asociados a tu usuario.'
              : 'El backend no siempre devuelve el organizador; mientras tanto se muestran los torneos disponibles en tu sesion.'}
          </p>
        </div>
        <Link to={ROUTES.tournamentsNew}>
          <Button>Crear torneo</Button>
        </Link>
      </div>
      <div className="stats-grid">
        <Card>
          <p className="metric-label">Total</p>
          <p className="metric-value">{myTournaments.length}</p>
        </Card>
        <Card>
          <p className="metric-label">Activos</p>
          <p className="metric-value">
            {myTournaments.filter((tournament) => tournament.active).length}
          </p>
        </Card>
        <Card>
          <p className="metric-label">Borradores</p>
          <p className="metric-value">
            {myTournaments.filter((tournament) => tournament.status === 'DRAFT').length}
          </p>
        </Card>
      </div>
      <Card>
        {myTournaments.length === 0 ? (
          <EmptyState
            title="Todavia no tienes torneos"
            description="Crea el primero para empezar a administrar rondas, participantes y votos."
          />
        ) : (
          <TournamentTable tournaments={myTournaments} />
        )}
      </Card>
      {collections.hasOwnershipData && otherTournaments.length > 0 ? (
        <Card>
          <div className="stack">
            <div>
              <p className="eyebrow">Referencia</p>
              <h2>Otros torneos visibles</h2>
              <p>Se muestran aparte para no mezclar tu trabajo con el de otros organizadores.</p>
            </div>
            <TournamentTable tournaments={otherTournaments} />
          </div>
        </Card>
      ) : null}
    </div>
  )
}
