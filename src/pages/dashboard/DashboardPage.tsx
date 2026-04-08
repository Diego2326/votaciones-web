import { Link } from 'react-router-dom'

import { useAuthStore } from '@/app/store/auth.store'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { PageError } from '@/components/feedback/PageError'
import { ROUTES } from '@/core/constants/routes'
import { toAppError } from '@/core/utils/errors'
import { useTournaments } from '@/features/tournaments/hooks/useTournaments'

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
  const myTournaments = tournaments.filter(
    (tournament) => !user?.id || !tournament.organizerId || tournament.organizerId === user.id,
  )
  const activeTournaments = myTournaments.filter((tournament) => tournament.active).length

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <section
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '16px',
          alignItems: 'flex-end',
          padding: '24px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #123a7a 0%, #0b1f49 58%, #08142f 100%)',
          color: '#f8fafc',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Panel del organizador
          </p>
          <h1 style={{ margin: 0 }}>{user ? `Hola, ${user.username}` : 'Dashboard'}</h1>
          <p style={{ margin: 0, maxWidth: '720px', color: 'rgba(226, 232, 240, 0.9)' }}>
            Este es un marcador visible del nuevo dashboard. Si ves esto, ya estamos
            editando la pantalla correcta.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to={ROUTES.tournaments}>
            <Button variant="ghost">Ver mis torneos</Button>
          </Link>
          <Link to={ROUTES.tournamentsNew}>
            <Button>Nuevo torneo</Button>
          </Link>
        </div>
      </section>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        <Card>
          <p className="metric-label">Mis torneos</p>
          <p className="metric-value">{myTournaments.length}</p>
        </Card>
        <Card>
          <p className="metric-label">Activos</p>
          <p className="metric-value">{activeTournaments}</p>
        </Card>
        <Card>
          <p className="metric-label">Activos</p>
          <p className="metric-value">{activeTournaments}</p>
        </Card>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        <Card>
          <p className="eyebrow">Comprobacion</p>
          <h2>Dashboard nuevo activo</h2>
          <p>Usuario: {user?.username ?? 'Sin usuario cargado'}</p>
          <p>Total de torneos cargados: {tournaments.length}</p>
        </Card>
        <Card>
          <p className="eyebrow">Siguiente paso</p>
          <h2>Entrar a torneos</h2>
          <p>Desde aqui deberias poder saltar al listado y luego crear o editar.</p>
        </Card>
      </div>
    </div>
  )
}
