import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function RouteErrorPage() {
  const error = useRouteError()

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Ocurrio un error inesperado en la navegacion'

  return (
    <div className="centered-state">
      <Card className="narrow">
        <div className="stack">
          <div>
            <p className="eyebrow">Error</p>
            <h1>No se pudo cargar la vista</h1>
            <p>{message}</p>
          </div>
          <Button onClick={() => window.location.assign('/dashboard')}>
            Volver al dashboard
          </Button>
        </div>
      </Card>
    </div>
  )
}
