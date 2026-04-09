import { Link, useSearchParams } from 'react-router-dom'

import { useJoinStore } from '@/app/store/join.store'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ROUTES } from '@/core/constants/routes'
import { formatTournamentCode, normalizeTournamentCode } from '@/core/utils/tournamentCode'

export function VoterHomePage() {
  const [searchParams] = useSearchParams()
  const code = normalizeTournamentCode(searchParams.get('code') ?? '')
  const session = useJoinStore((state) => state.session)

  return (
    <div className="stack">
      <Card className="arena-hero-card">
        <div className="arena-hero-grid">
          <div className="stack">
            <p className="eyebrow">Lobby</p>
            <h2>Tu voto entra como una jugada, no como un formulario</h2>
            <p className="arena-copy">
              Une tu sesion, entra al torneo correcto y avanza ronda por ronda hasta emitir tu
              decision final.
            </p>
            {code ? (
              <p className="arena-code-chip">Codigo detectado: {formatTournamentCode(code)}</p>
            ) : null}
            <div className="inline-group">
              <Link to={code ? `${ROUTES.voteJoin}?pin=${encodeURIComponent(code)}` : ROUTES.voteJoin}>
                <Button>Entrar con PIN</Button>
              </Link>
              {session ? (
                <Link to={ROUTES.voteTournament.replace(':id', session.tournamentId)}>
                  <Button variant="secondary">Continuar sesion</Button>
                </Link>
              ) : null}
            </div>
          </div>
          <div className="arena-stat-board">
            <div className="arena-stat-card">
              <span className="metric-label">Estado</span>
              <strong>{session ? 'Dentro del juego' : 'Esperando acceso'}</strong>
            </div>
            <div className="arena-stat-card">
              <span className="metric-label">Alias</span>
              <strong>{session?.displayName ?? 'Invitado'}</strong>
            </div>
            <div className="arena-stat-card">
              <span className="metric-label">Torneo activo</span>
              <strong>{session?.tournamentTitle ?? 'Sin seleccionar'}</strong>
            </div>
          </div>
        </div>
      </Card>

      <div className="detail-grid">
        <Card className="arena-mode-card">
          <p className="eyebrow">Modo de juego</p>
          <h2>1. Unete</h2>
          <p>Usa PIN o QR y abre tu sesion en segundos.</p>
        </Card>
        <Card className="arena-mode-card">
          <p className="eyebrow">Modo de juego</p>
          <h2>2. Elige ronda</h2>
          <p>Entra directo a la etapa abierta y revisa los duelos disponibles.</p>
        </Card>
        <Card className="arena-mode-card">
          <p className="eyebrow">Modo de juego</p>
          <h2>3. Decide</h2>
          <p>Vota en el enfrentamiento y sigue el marcador en vivo.</p>
        </Card>
      </div>
    </div>
  )
}
