import { useMemo, type PropsWithChildren } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

import { useAuthStore } from '@/app/store/auth.store'
import { Button } from '@/components/ui/Button'
import { ROLES } from '@/core/constants/roles'
import { ROUTES } from '@/core/constants/routes'

function getSectionMeta(pathname: string) {
  if (pathname.startsWith('/tournaments/')) {
    return {
      eyebrow: 'Workspace',
      title: 'Operacion de torneo',
      description: 'Acciones, estructura y acceso reunidos en un mismo flujo.',
    }
  }

  if (pathname.startsWith('/tournaments')) {
    return {
      eyebrow: 'Organizacion',
      title: 'Portafolio de torneos',
      description: 'Desde aqui creas, ordenas y auditas los torneos activos.',
    }
  }

  if (pathname.startsWith('/users')) {
    return {
      eyebrow: 'Administracion',
      title: 'Control de usuarios',
      description: 'Gestion de estado, roles y supervision de accesos.',
    }
  }

  if (pathname.startsWith('/audit')) {
    return {
      eyebrow: 'Auditoria',
      title: 'Trazabilidad del sistema',
      description: 'Actividad clave del producto y acciones sensibles.',
    }
  }

  return {
    eyebrow: 'Control Room',
    title: 'Panel principal',
    description: 'Resumen rapido del sistema y de los torneos que estas operando.',
  }
}

export function AppLayout({ children }: PropsWithChildren) {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const clearSession = useAuthStore((state) => state.clearSession)
  const sectionMeta = getSectionMeta(location.pathname)
  const navGroups = useMemo(() => {
    const tournamentLinks = [
      { to: ROUTES.dashboard, label: 'Dashboard' },
      { to: ROUTES.tournaments, label: 'Torneos' },
    ]

    const governanceLinks = []

    if (user?.roles.includes(ROLES.ADMIN)) {
      governanceLinks.push({ to: ROUTES.users, label: 'Usuarios' })
    }

    if (user?.roles.includes(ROLES.ADMIN) || user?.roles.includes(ROLES.ORGANIZER)) {
      governanceLinks.push({ to: ROUTES.audit, label: 'Auditoria' })
    }

    return [
      { title: 'Operacion', links: tournamentLinks },
      { title: 'Gobierno', links: governanceLinks },
    ].filter((group) => group.links.length > 0)
  }, [user?.roles])

  return (
    <div className="shell-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <p className="eyebrow">Control room</p>
          <h2>Votaciones Arena</h2>
          <p className="sidebar-copy">
            Organiza torneos, ejecuta rondas y abre una presentacion lista para pantalla grande.
          </p>
        </div>
        <div className="sidebar-quick-actions">
          <Link to={ROUTES.tournamentsNew}>
            <Button fullWidth>Nuevo torneo</Button>
          </Link>
          <Link to={ROUTES.voteHome}>
            <Button variant="ghost" fullWidth>
              Portal votante
            </Button>
          </Link>
        </div>
        <div className="sidebar-groups">
          {navGroups.map((group) => (
            <section key={group.title} className="sidebar-group">
              <p className="sidebar-group-title">{group.title}</p>
              <nav className="sidebar-nav">
                {group.links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </section>
          ))}
        </div>
      </aside>
      <div className="shell-main">
        <header className="topbar topbar-rich">
          <div>
            <p className="topbar-kicker">{sectionMeta.eyebrow}</p>
            <p className="topbar-title">{sectionMeta.title}</p>
            <p className="topbar-subtitle">{sectionMeta.description}</p>
          </div>
          <div className="topbar-actions">
            <div className="topbar-user-card">
              <span className="topbar-user-label">{user?.roles.join(' · ') ?? 'Sin rol'}</span>
              <strong>{user?.fullName ?? user?.username ?? 'Sin sesion'}</strong>
            </div>
            <Button variant="secondary" onClick={clearSession}>
              Cerrar sesion
            </Button>
          </div>
        </header>
        <main className="page-content page-content-spacious">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  )
}
