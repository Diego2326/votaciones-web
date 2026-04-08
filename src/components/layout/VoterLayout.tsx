import { NavLink, Outlet } from 'react-router-dom'

import { ROUTES } from '@/core/constants/routes'

export function VoterLayout() {
  return (
    <div className="voter-layout">
      <header className="voter-header">
        <div>
          <p className="eyebrow">Portal del votante</p>
          <h1>Vota rapido y sigue los resultados</h1>
        </div>
        <nav className="voter-nav">
          <NavLink to={ROUTES.voteHome}>Inicio</NavLink>
          <NavLink to={ROUTES.voteTournaments}>Torneos</NavLink>
        </nav>
      </header>
      <main className="voter-main">
        <Outlet />
      </main>
    </div>
  )
}
