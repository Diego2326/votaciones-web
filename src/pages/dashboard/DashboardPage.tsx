import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { PageError } from '@/components/feedback/PageError'
import { toAppError } from '@/core/utils/errors'
import { useTournaments } from '@/features/tournaments/hooks/useTournaments'
import { useTournamentLiveUpdates } from '@/features/websocket/hooks/useTournamentLiveUpdates'

export function DashboardPage() {
  const tournamentsQuery = useTournaments()
  const latestEvent = useTournamentLiveUpdates()

  if (tournamentsQuery.isLoading) {
    return <Loader label="Cargando dashboard..." />
  }

  if (tournamentsQuery.isError) {
    return <PageError message={toAppError(tournamentsQuery.error).message} />
  }

  const tournaments = tournamentsQuery.data ?? []
  const activeRounds = tournaments.filter((tournament) => tournament.active).length

  return (
    <div className="stack">
      <div>
        <p className="eyebrow">Panel</p>
        <h1>Dashboard</h1>
      </div>
      <div className="stats-grid">
        <Card>
          <p className="metric-label">Torneos</p>
          <p className="metric-value">{tournaments.length}</p>
        </Card>
        <Card>
          <p className="metric-label">Activos</p>
          <p className="metric-value">{activeRounds}</p>
        </Card>
        <Card>
          <p className="metric-label">Resultados recientes</p>
          <p className="metric-value">
            {tournaments.filter((item) => item.status === 'CLOSED').length}
          </p>
        </Card>
      </div>
      <Card>
        <div className="stack">
          <h2>Actividad en tiempo real</h2>
          <p>
            {latestEvent
              ? `${latestEvent.type} recibido a las ${latestEvent.emittedAt}`
              : 'Conecta un torneo o ronda para ver eventos STOMP en vivo.'}
          </p>
        </div>
      </Card>
    </div>
  )
}
