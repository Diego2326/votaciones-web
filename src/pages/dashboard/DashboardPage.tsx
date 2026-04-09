import { Link } from 'react-router-dom'

import { useAuthStore } from '@/app/store/auth.store'
import { PageError } from '@/components/feedback/PageError'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { ROUTES } from '@/core/constants/routes'
import { toAppError } from '@/core/utils/errors'
import { useTournaments } from '@/features/tournaments/hooks/useTournaments'
import { getTournamentCollections } from '@/features/tournaments/utils/tournamentCollections'
import { isAdminUser } from '@/features/tournaments/utils/ownership'

export function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const tournamentsQuery = useTournaments()

  if (tournamentsQuery.isLoading) {
    return <Loader label="Cargando dashboard..." />
  }

  if (tournamentsQuery.isError) {
    return <PageError message={toAppError(tournamentsQuery.error).message} />
  }

  const tournaments = tournamentsQuery.data ?? []
  const collections = getTournamentCollections(tournaments, user)
  const myTournaments = collections.mine
  const isAdmin = isAdminUser(user)
  const activeTournaments = myTournaments.filter((tournament) => tournament.active)
  const draftTournaments = myTournaments.filter((tournament) => tournament.status === 'DRAFT')
  const liveTournaments = myTournaments.filter((tournament) => tournament.status === 'ACTIVE')
  const latestTournaments = [...myTournaments].slice(0, 4)

  return (
    <div className="stack">
      <Card className="dashboard-hero">
        <div className="stack">
          <p className="eyebrow">{isAdmin ? 'Control administrativo' : 'Control del organizador'}</p>
          <h1>{user ? `Hola, ${user.username}` : 'Panel principal'}</h1>
        </div>
        <div className="dashboard-hero-actions">
          <Link to={ROUTES.tournaments}>
            <Button variant="secondary">Ver torneos</Button>
          </Link>
          <Link to={ROUTES.tournamentsNew}>
            <Button>Crear torneo</Button>
          </Link>
        </div>
      </Card>

      <div className="stats-grid">
        <Card className="dashboard-highlight">
          <p className="metric-label">{isAdmin ? 'Torneos visibles' : 'Mis torneos'}</p>
          <p className="metric-value">{myTournaments.length}</p>
          <p className="label-muted">
            {isAdmin ? 'Cartera completa disponible en la sesion actual' : 'Espacios bajo tu operacion directa'}
          </p>
        </Card>
        <Card className="dashboard-highlight">
          <p className="metric-label">En vivo</p>
          <p className="metric-value">{liveTournaments.length}</p>
          <p className="label-muted">Actualmente abiertos a votacion</p>
        </Card>
        <Card className="dashboard-highlight">
          <p className="metric-label">Borradores</p>
          <p className="metric-value">{draftTournaments.length}</p>
          <p className="label-muted">Pendientes de estructurar o publicar</p>
        </Card>
        <Card className="dashboard-highlight">
          <p className="metric-label">Activos</p>
          <p className="metric-value">{activeTournaments.length}</p>
          <p className="label-muted">Con interaccion real o listos para show</p>
        </Card>
      </div>

      <div className="detail-grid">
        <Card className="workspace-panel">
          <div className="page-header">
            <div>
              <p className="eyebrow">Acciones rapidas</p>
              <h2>Siguiente mejor paso</h2>
            </div>
          </div>
          <div className="workflow-list">
            <Link to={ROUTES.tournamentsNew} className="workflow-link-card">
              <strong>Crear un nuevo torneo</strong>
            </Link>
            <Link to={ROUTES.tournaments} className="workflow-link-card">
              <strong>Entrar a un torneo existente</strong>
            </Link>
            <Link to={ROUTES.voteHome} className="workflow-link-card">
              <strong>Revisar experiencia del votante</strong>
            </Link>
          </div>
        </Card>

        <Card className="workspace-panel">
          <div className="page-header">
            <div>
              <p className="eyebrow">Radar</p>
              <h2>Torneos a mano</h2>
            </div>
          </div>
          {latestTournaments.length === 0 ? (
            <p className="label-muted">
              {isAdmin ? 'Todavia no hay torneos visibles en el sistema.' : 'Todavia no tienes torneos cargados.'}
            </p>
          ) : (
            <div className="dashboard-list">
              {latestTournaments.map((tournament) => (
                <Link
                  key={tournament.id}
                  to={ROUTES.tournamentDetail.replace(':id', tournament.id)}
                  className="workspace-round-card"
                >
                  <div>
                    <p className="eyebrow">{tournament.type}</p>
                    <strong>{tournament.name}</strong>
                    <p className="label-muted">{tournament.description ?? 'Sin descripcion'}</p>
                  </div>
                  <span className="label-muted">{tournament.status}</span>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
