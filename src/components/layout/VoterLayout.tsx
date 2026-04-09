import type { PropsWithChildren } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

import { useJoinStore } from '@/app/store/join.store'
import { Badge } from '@/components/ui/Badge'
import { ROUTES } from '@/core/constants/routes'

export function VoterLayout({ children }: PropsWithChildren) {
  const session = useJoinStore((state) => state.session)

  return (
    <div className="voter-layout arena-layout">
      <header className="voter-header arena-header">
        <div className="arena-header-copy">
          <p className="eyebrow">Arena del votante</p>
          <h1>Entra, elige tu bando y define el resultado</h1>
        </div>
        <div className="arena-header-side">
          {session ? (
            <div className="arena-session-card">
              <span className="label-muted">Sesion activa</span>
              <strong>{session.displayName ?? 'Anonimo'}</strong>
              <span className="label-muted">{session.tournamentTitle}</span>
            </div>
          ) : (
            <div className="arena-session-card">
              <span className="label-muted">Estado</span>
              <strong>Sin sesion</strong>
              <span className="label-muted">Unete con PIN o QR</span>
            </div>
          )}
          <nav className="voter-nav arena-nav">
            <NavLink to={ROUTES.voteHome} className={({ isActive }) => (isActive ? 'arena-nav-link active' : 'arena-nav-link')}>
              Inicio
            </NavLink>
            <NavLink to={ROUTES.voteJoin} className={({ isActive }) => (isActive ? 'arena-nav-link active' : 'arena-nav-link')}>
              Unirme
            </NavLink>
          </nav>
          <Badge tone={session ? 'success' : 'warning'}>{session ? 'Listo para votar' : 'Esperando acceso'}</Badge>
        </div>
      </header>
      <main className="voter-main arena-main">{children ?? <Outlet />}</main>
    </div>
  )
}
