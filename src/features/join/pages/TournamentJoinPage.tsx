import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { useJoinStore } from '@/app/store/join.store'
import { EmptyState } from '@/components/feedback/EmptyState'
import { PageError } from '@/components/feedback/PageError'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Loader } from '@/components/ui/Loader'
import { ROUTES } from '@/core/constants/routes'
import { toAppError } from '@/core/utils/errors'
import {
  useJoinAccessInfo,
  useJoinByAuth,
  useJoinByName,
  useJoinByQr,
} from '@/features/join/hooks/useJoin'

export function TournamentJoinPage() {
  const [searchParams] = useSearchParams()
  const { qrToken } = useParams()
  const pin = searchParams.get('pin')?.trim() || undefined
  const navigate = useNavigate()
  const setSession = useJoinStore((state) => state.setSession)
  const existingSession = useJoinStore((state) => state.session)
  const accessInfoQuery = useJoinAccessInfo(pin, qrToken)
  const joinByNameMutation = useJoinByName()
  const joinByAuthMutation = useJoinByAuth()
  const joinByQrMutation = useJoinByQr()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  if (!pin && !qrToken) {
    return (
      <Card className="arena-mode-card">
        <EmptyState
          title="Falta el acceso"
          description="Ingresa con PIN o QR."
        />
      </Card>
    )
  }

  if (accessInfoQuery.isLoading) {
    return <Loader label="Validando acceso al torneo..." />
  }

  if (accessInfoQuery.isError || !accessInfoQuery.data) {
    return <PageError message={toAppError(accessInfoQuery.error).message} />
  }

  const accessInfo = accessInfoQuery.data
  const effectiveDisplayName =
    displayName || (accessInfo.mode === 'ANONYMOUS' ? 'Invitado' : '')
  const activeMutationError = joinByNameMutation.error ?? joinByAuthMutation.error ?? joinByQrMutation.error
  const isSubmitting =
    joinByNameMutation.isPending || joinByAuthMutation.isPending || joinByQrMutation.isPending

  const handleJoinSuccess = (sessionToken: Parameters<typeof setSession>[0]) => {
    setSession(sessionToken)
    navigate(`/vote/tournaments/${sessionToken.tournamentId}`)
  }

  const buildNamePayload = () => ({
    displayName: effectiveDisplayName,
    ...(pin ? { pin } : {}),
    ...(qrToken ? { qrToken } : {}),
  })

  const buildAuthPayload = () => ({
    email,
    password,
    ...(pin ? { pin } : {}),
    ...(qrToken ? { qrToken } : {}),
    ...(firstName ? { firstName } : {}),
    ...(lastName ? { lastName } : {}),
  })

  return (
    <Card className="arena-hero-card">
      <div className="stack">
        <div>
          <p className="eyebrow">Checkpoint de ingreso</p>
          <h1>Unirse a la votacion</h1>
          <p className="arena-code-chip">PIN {accessInfo.joinPin}</p>
        </div>
        {activeMutationError ? (
          <PageError message={toAppError(activeMutationError).message} />
        ) : null}
        {existingSession?.tournamentId === accessInfo.tournamentId ? (
          <div className="inline-group">
            <Button onClick={() => navigate(`/vote/tournaments/${existingSession.tournamentId}`)}>
              Continuar sesion
            </Button>
            <Link to={ROUTES.voteHome}>
              <Button variant="ghost">Volver al inicio</Button>
            </Link>
          </div>
        ) : null}
        {accessInfo.mode === 'EMAIL_PASSWORD' ? (
          <form
            className="form-grid columns-2"
            onSubmit={(event) => {
              event.preventDefault()
              joinByAuthMutation.mutate(
                buildAuthPayload(),
                {
                  onSuccess: handleJoinSuccess,
                },
              )
            }}
          >
            <Input
              id="join-email"
              type="email"
              label="Correo"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <Input
              id="join-password"
              type="password"
              label="Contrasena"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <Input
              id="join-first-name"
              label="Nombre"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
            <Input
              id="join-last-name"
              label="Apellido"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Entrar al torneo'}
            </Button>
          </form>
        ) : (
          <form
            className="form-grid"
            onSubmit={(event) => {
              event.preventDefault()
              joinByNameMutation.mutate(
                buildNamePayload(),
                {
                  onSuccess: handleJoinSuccess,
                },
              )
            }}
          >
            <Input
              id="join-display-name"
              label={accessInfo.mode === 'ANONYMOUS' ? 'Alias opcional' : 'Nombre visible'}
              value={displayName || (accessInfo.mode === 'ANONYMOUS' ? 'Invitado' : '')}
              onChange={(event) => setDisplayName(event.target.value)}
              required
            />
            <div className="inline-group">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Entrando...' : 'Crear sesion'}
              </Button>
              {qrToken && accessInfo.mode === 'ANONYMOUS' ? (
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isSubmitting}
                  onClick={() =>
                    joinByQrMutation.mutate(
                      { qrToken },
                      {
                        onSuccess: handleJoinSuccess,
                      },
                    )
                  }
                >
                  Entrar sin nombre
                </Button>
              ) : null}
            </div>
          </form>
        )}
      </div>
    </Card>
  )
}
