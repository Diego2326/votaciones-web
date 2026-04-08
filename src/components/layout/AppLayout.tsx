import { NavLink, Outlet } from 'react-router-dom'

import { useAuthStore } from '@/app/store/auth.store'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/core/constants/routes'

const links = [
  { to: ROUTES.dashboard, label: 'Dashboard' },
  { to: ROUTES.tournaments, label: 'Torneos' },
  { to: ROUTES.users, label: 'Usuarios' },
  { to: ROUTES.audit, label: 'Auditoria' },
]

export function AppLayout() {
  const user = useAuthStore((state) => state.user)
  const clearSession = useAuthStore((state) => state.clearSession)

  return (
    <div className="shell-layout">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Organizador</p>
          <h2>Votaciones</h2>
        </div>
        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="shell-main">
        <header className="topbar">
          <div>
            <p className="topbar-title">Sistema de votaciones</p>
            <p className="topbar-subtitle">{user?.username ?? 'Sin sesion'}</p>
          </div>
          <Button variant="secondary" onClick={clearSession}>
            Cerrar sesion
          </Button>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
