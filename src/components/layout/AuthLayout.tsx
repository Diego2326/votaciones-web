import type { PropsWithChildren } from 'react'
import { Link, Outlet } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/core/constants/routes'

export function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="auth-layout">
      <div className="auth-hero">
        <div className="auth-brand">
          <span className="live-brand-mark" />
          <span>Votaciones Live</span>
        </div>
        <div className="auth-copy">
          <p className="eyebrow">Acceso de organizador</p>
          <h1>Administra el torneo en vivo</h1>
          <p>
            Entra para abrir rondas, monitorear votos y controlar la experiencia
            del evento.
          </p>
        </div>
        <Link to={ROUTES.root} className="auth-home-link">
          <Button variant="secondary">Volver al inicio</Button>
        </Link>
      </div>
      <div className="auth-panel">
        {children ?? <Outlet />}
      </div>
    </div>
  )
}
