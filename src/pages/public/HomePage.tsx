import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { ROUTES } from '@/core/constants/routes'
import {
  formatTournamentCode,
  isCompleteTournamentCode,
  normalizeTournamentCode,
} from '@/core/utils/tournamentCode'

export function HomePage() {
  const [code, setCode] = useState('')
  const navigate = useNavigate()

  const handleJoin = () => {
    const nextCode = normalizeTournamentCode(code)

    if (nextCode.length !== 6) {
      return
    }

    navigate(`${ROUTES.voteTournaments}?code=${encodeURIComponent(nextCode)}`)
  }

  return (
    <main className="live-home">
      <header className="live-header">
        <div className="live-brand">
          <span className="live-brand-mark" />
          <span>Votaciones Live</span>
        </div>
        <Link to={ROUTES.login}>
          <Button variant="secondary">Organizador</Button>
        </Link>
      </header>

      <section className="live-hero">
        <Card className="live-join-card">
          <div className="stack">
            <div className="live-center-copy">
              <p className="eyebrow live-eyebrow">Torneo en vivo</p>
              <h1>Ingresa el codigo</h1>
            </div>
            <Input
              id="tournament-code"
              label="Codigo del torneo"
              placeholder="123 456"
              value={code}
              inputMode="numeric"
              maxLength={7}
              onChange={(event) =>
                setCode(formatTournamentCode(event.target.value))
              }
            />
            <Button
              fullWidth
              onClick={handleJoin}
              disabled={!isCompleteTournamentCode(code)}
            >
              Entrar
            </Button>
          </div>
        </Card>
      </section>

      <section className="live-footnote">
        <p>Usa el codigo compartido por el organizador para unirte a la votacion.</p>
      </section>
    </main>
  )
}
