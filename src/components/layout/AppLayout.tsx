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
      title: 'Torneo en curso',
      description: '',
    }
  }

  if (pathname.startsWith('/tournaments')) {
    return {
      eyebrow: 'Organizacion',
      title: 'Portafolio de torneos',
      description: '',
    }
  }

  if (pathname.startsWith('/users')) {
    return {
      eyebrow: 'Administracion',
      title: 'Control de usuarios',
      description: '',
    }
  }

  if (pathname.startsWith('/audit')) {
    return {
      eyebrow: 'Auditoria',
      title: 'Trazabilidad del sistema',
      description: '',
    }
  }

  return {
    eyebrow: 'Control Room',
    title: 'Panel principal',
    description: '',
  }
}

export function AppLayout({ children }: PropsWithChildren) {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const clearSession = useAuthStore((state) => state.clearSession)
  const sectionMeta = getSectionMeta(location.pathname)
  const topbarLinks = useMemo(() => {
    const links: Array<{ to: string; label: string }> = [
      { to: ROUTES.dashboard, label: 'Dashboard' },
      { to: ROUTES.tournaments, label: 'Torneos' },
    ]

    if (user?.roles.includes(ROLES.ADMIN)) {
      links.push({ to: ROUTES.users, label: 'Usuarios' })
    }

    if (user?.roles.includes(ROLES.ADMIN) || user?.roles.includes(ROLES.ORGANIZER)) {
      links.push({ to: ROUTES.audit, label: 'Auditoria' })
    }

    return links
  }, [user?.roles])

  return (
    <div className="shell-layout">
      <div className="shell-main shell-main-full">
        <header className="topbar topbar-rich">
          <div className="topbar-context">
            <p className="topbar-kicker">{sectionMeta.eyebrow}</p>
            <p className="topbar-title">{sectionMeta.title}</p>
            {sectionMeta.description ? <p className="topbar-subtitle">{sectionMeta.description}</p> : null}
          </div>
          <nav className="topbar-nav">
            {topbarLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  isActive ? 'topbar-nav-link active' : 'topbar-nav-link'
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="topbar-actions">
            <div className="topbar-cta">
              <Link to={ROUTES.tournamentsNew}>
                <Button>Nuevo torneo</Button>
              </Link>
              <Link to={ROUTES.voteHome}>
                <Button variant="ghost">Portal votante</Button>
              </Link>
            </div>
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
