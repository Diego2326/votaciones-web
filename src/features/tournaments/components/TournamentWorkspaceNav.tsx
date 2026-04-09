import { generatePath, NavLink } from 'react-router-dom'

import { ROUTES } from '@/core/constants/routes'

const items = [
  { key: 'overview', label: 'Centro', route: ROUTES.tournamentDetail },
  { key: 'participants', label: 'Participantes', route: ROUTES.tournamentParticipants },
  { key: 'rounds', label: 'Setup', route: ROUTES.tournamentRounds },
  { key: 'presentation', label: 'Presentacion', route: ROUTES.tournamentPresentation },
] as const

export function TournamentWorkspaceNav({
  tournamentId,
  tournamentName,
}: {
  tournamentId: string
  tournamentName?: string | null
}) {
  return (
    <section className="workspace-shell">
      <div className="workspace-copy">
        <p className="eyebrow">Workspace del torneo</p>
        <h2>{tournamentName ?? 'Centro de control'}</h2>
        <p className="workspace-description">
          Gestiona participantes, setup del torneo y la vista de presentacion desde un solo bloque.
        </p>
      </div>
      <nav className="workspace-nav">
        {items.map((item) => (
          <NavLink
            key={item.key}
            to={generatePath(item.route, { id: tournamentId })}
            className={({ isActive }) => (isActive ? 'workspace-link active' : 'workspace-link')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </section>
  )
}
