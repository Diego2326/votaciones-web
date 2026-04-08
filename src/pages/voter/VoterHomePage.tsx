import { Link, useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ROUTES } from '@/core/constants/routes'
import { formatTournamentCode, normalizeTournamentCode } from '@/core/utils/tournamentCode'

export function VoterHomePage() {
  const [searchParams] = useSearchParams()
  const code = normalizeTournamentCode(searchParams.get('code') ?? '')

  return (
    <div className="detail-grid">
      <Card>
        <div className="stack">
          <p className="eyebrow">Portal del votante</p>
          <h1>Accede a torneos y emite tu voto</h1>
          <p>
            Flujo optimizado para votar rapido, revisar si ya participaste y ver
            resultados publicados.
          </p>
          {code ? (
            <p className="label-muted">
              Codigo recibido: {formatTournamentCode(code)}
            </p>
          ) : null}
          <Link to={ROUTES.voteTournaments}>
            <Button>Ver torneos disponibles</Button>
          </Link>
        </div>
      </Card>
      <Card>
        <div className="stack">
          <p className="eyebrow">Tiempo real</p>
          <h2>Resultados en vivo</h2>
          <p>Los topics STOMP permiten refrescar conteos y estados sin recargar.</p>
        </div>
      </Card>
    </div>
  )
}
