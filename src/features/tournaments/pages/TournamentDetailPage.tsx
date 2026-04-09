import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { EmptyState } from '@/components/feedback/EmptyState'
import { PageError } from '@/components/feedback/PageError'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { Select } from '@/components/ui/Select'
import { ROUTES } from '@/core/constants/routes'
import { toAppError } from '@/core/utils/errors'
import {
  useRegenerateTournamentPin,
  useTournamentAccess,
  useUpdateTournamentAccess,
} from '@/features/join/hooks/useJoin'
import { buildQrImageUrl, buildTournamentQrJoinUrl } from '@/features/join/utils/qr'
import { useParticipants } from '@/features/participants/hooks/useParticipants'
import { useRounds } from '@/features/rounds/hooks/useRounds'
import { tournamentApi } from '@/features/tournaments/api/tournamentApi'
import { TournamentWorkspaceNav } from '@/features/tournaments/components/TournamentWorkspaceNav'
import { useTournament } from '@/features/tournaments/hooks/useTournament'
import { TOURNAMENT_ACCESS_MODES } from '@/features/tournaments/types/tournament.types'
import { useTournamentLiveUpdates } from '@/features/websocket/hooks/useTournamentLiveUpdates'

export function TournamentDetailPage() {
  const { id = '' } = useParams()
  const tournamentQuery = useTournament(id)
  const participantsQuery = useParticipants(id)
  const roundsQuery = useRounds(id)
  const accessQuery = useTournamentAccess(id)
  const updateAccessMutation = useUpdateTournamentAccess(id)
  const regeneratePinMutation = useRegenerateTournamentPin(id)
  const queryClient = useQueryClient()
  const event = useTournamentLiveUpdates(id)
  const [draftAccessMode, setDraftAccessMode] = useState<
    'EMAIL_PASSWORD' | 'DISPLAY_NAME' | 'ANONYMOUS' | null
  >(null)

  const actionMutation = useMutation({
    mutationFn: async (action: 'publish' | 'activate' | 'pause' | 'close') => {
      switch (action) {
        case 'publish':
          return tournamentApi.publish(id)
        case 'activate':
          return tournamentApi.activate(id)
        case 'pause':
          return tournamentApi.pause(id)
        case 'close':
          return tournamentApi.close(id)
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tournaments', id] })
      void queryClient.invalidateQueries({ queryKey: ['tournaments'] })
      void queryClient.invalidateQueries({ queryKey: ['tournaments', id, 'access'] })
      void queryClient.invalidateQueries({ queryKey: ['participants', id] })
      void queryClient.invalidateQueries({ queryKey: ['rounds', id] })
    },
  })

  if (tournamentQuery.isLoading) {
    return <Loader label="Cargando detalle del torneo..." />
  }

  if (tournamentQuery.isError || !tournamentQuery.data) {
    return <PageError message={toAppError(tournamentQuery.error).message} />
  }

  const tournament = tournamentQuery.data
  const participants = participantsQuery.data ?? []
  const rounds = roundsQuery.data ?? []
  const accessMode = draftAccessMode ?? accessQuery.data?.mode ?? 'ANONYMOUS'
  const frontendJoinUrl = accessQuery.data?.qrToken
    ? buildTournamentQrJoinUrl(accessQuery.data.qrToken)
    : null
  const qrImageUrl = frontendJoinUrl ? buildQrImageUrl(frontendJoinUrl) : null
  const completedRounds = rounds.filter((round) =>
    ['CLOSED', 'PROCESSING', 'PUBLISHED'].includes(round.status),
  ).length

  return (
    <div className="stack">
      <Card className="workspace-hero">
        <div className="workspace-hero-header">
          <div className="stack">
            <div className="workspace-status-line">
              <p className="eyebrow">Centro del torneo</p>
              <Badge tone={tournament.active ? 'success' : 'warning'}>{tournament.status}</Badge>
            </div>
            <h1>{tournament.name}</h1>
            <p className="workspace-hero-copy">
              {tournament.description || 'Este torneo ya esta listo para participantes, rondas y votacion.'}
            </p>
          </div>
          <div className="workspace-hero-actions">
            <Link to={ROUTES.tournamentEdit.replace(':id', id)}>
              <Button variant="secondary">Editar torneo</Button>
            </Link>
            <Link to={ROUTES.tournamentPresentation.replace(':id', id)} target="_blank" rel="noreferrer">
              <Button>Presentar</Button>
            </Link>
          </div>
        </div>
        <div className="workspace-kpis">
          <div className="workspace-kpi">
            <span className="metric-label">Participantes</span>
            <strong>{participants.length}</strong>
            <span className="label-muted">Listos para emparejar</span>
          </div>
          <div className="workspace-kpi">
            <span className="metric-label">Rondas</span>
            <strong>{rounds.length}</strong>
            <span className="label-muted">{completedRounds} con avance real</span>
          </div>
          <div className="workspace-kpi">
            <span className="metric-label">Tipo</span>
            <strong>{tournament.type}</strong>
            <span className="label-muted">Modo de estructura</span>
          </div>
          <div className="workspace-kpi">
            <span className="metric-label">Acceso</span>
            <strong>{accessQuery.data?.mode ?? tournament.accessMode}</strong>
            <span className="label-muted">Entrada del votante</span>
          </div>
        </div>
        <div className="table-actions">
          <Button onClick={() => actionMutation.mutate('publish')}>Publicar</Button>
          <Button variant="secondary" onClick={() => actionMutation.mutate('activate')}>
            Activar
          </Button>
          <Button variant="secondary" onClick={() => actionMutation.mutate('pause')}>
            Pausar
          </Button>
          <Button variant="danger" onClick={() => actionMutation.mutate('close')}>
            Cerrar
          </Button>
        </div>
        {event ? (
          <div className="live-pill">
            Evento en vivo: {event.type} · {new Date(event.emittedAt).toLocaleString()}
          </div>
        ) : null}
      </Card>

      <TournamentWorkspaceNav tournamentId={id} tournamentName={tournament.name} />

      <div className="detail-grid">
        <Card className="workspace-panel">
          <div className="stack">
            <div className="page-header">
              <div>
                <p className="eyebrow">Acceso</p>
                <h2>Puerta de entrada del torneo</h2>
              </div>
            </div>
            {accessQuery.isLoading ? <Loader label="Cargando acceso..." /> : null}
            {accessQuery.isError ? (
              <PageError message={toAppError(accessQuery.error).message} />
            ) : null}
            {accessQuery.data ? (
              <>
                <div className="workspace-access-grid">
                  <div className="workspace-access-item">
                    <span className="label-muted">PIN</span>
                    <strong>{accessQuery.data.joinPin}</strong>
                  </div>
                  <div className="workspace-access-item">
                    <span className="label-muted">QR Token</span>
                    <strong>{accessQuery.data.qrToken}</strong>
                  </div>
                  <div className="workspace-access-item">
                    <span className="label-muted">URL activa</span>
                    {frontendJoinUrl ? (
                      <a href={frontendJoinUrl} target="_blank" rel="noreferrer">
                        {frontendJoinUrl}
                      </a>
                    ) : (
                      <span className="label-muted">Pendiente de generar</span>
                    )}
                  </div>
                </div>
                {qrImageUrl ? (
                  <div className="workspace-qr-block">
                    <img
                      src={qrImageUrl}
                      alt={`QR de acceso para ${tournament.name}`}
                      width={220}
                      height={220}
                    />
                    <p className="label-muted">
                      Este QR siempre apunta al frontend actual para evitar enlaces rotos.
                    </p>
                  </div>
                ) : null}
                <div className="inline-group">
                  <Select
                    id="tournament-access-mode-detail"
                    value={accessMode}
                    label="Modo de acceso"
                    onChange={(event) =>
                      setDraftAccessMode(
                        event.target.value as 'EMAIL_PASSWORD' | 'DISPLAY_NAME' | 'ANONYMOUS',
                      )
                    }
                  >
                    {TOURNAMENT_ACCESS_MODES.map((mode) => (
                      <option key={mode} value={mode}>
                        {mode}
                      </option>
                    ))}
                  </Select>
                  <Button
                    variant="secondary"
                    disabled={updateAccessMutation.isPending}
                    onClick={() => updateAccessMutation.mutate(accessMode)}
                  >
                    Guardar acceso
                  </Button>
                  <Button
                    variant="ghost"
                    disabled={regeneratePinMutation.isPending}
                    onClick={() => regeneratePinMutation.mutate()}
                  >
                    Regenerar PIN
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </Card>

        <Card className="workspace-panel">
          <div className="stack">
            <div>
              <p className="eyebrow">Checklist</p>
              <h2>Ruta recomendada</h2>
            </div>
            <div className="workflow-list">
              <div className="workflow-step">
                <span className="workflow-step-number">1</span>
                <div>
                  <strong>Define acceso y QR</strong>
                  <p>Configura el modo de entrada antes de abrir la votacion.</p>
                </div>
              </div>
              <div className="workflow-step">
                <span className="workflow-step-number">2</span>
                <div>
                  <strong>Carga participantes</strong>
                  <p>{participants.length} participantes registrados hasta ahora.</p>
                </div>
              </div>
              <div className="workflow-step">
                <span className="workflow-step-number">3</span>
                <div>
                  <strong>Construye rondas y matches</strong>
                  <p>{rounds.length} rondas creadas para este torneo.</p>
                </div>
              </div>
              <div className="workflow-step">
                <span className="workflow-step-number">4</span>
                <div>
                  <strong>Abre la presentacion</strong>
                  <p>Ideal para proyectar resultados y enfrentamientos en vivo.</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="detail-grid">
        <Card className="workspace-panel">
          <div className="page-header">
            <div>
              <p className="eyebrow">Participantes</p>
              <h2>Plantilla actual</h2>
            </div>
            <Link to={ROUTES.tournamentParticipants.replace(':id', id)}>
              <Button variant="ghost">Administrar</Button>
            </Link>
          </div>
          {participants.length === 0 ? (
            <EmptyState
              title="Sin participantes"
              description="Carga la base del torneo para empezar a emparejar."
            />
          ) : (
            <div className="workspace-roster">
              {participants.slice(0, 6).map((participant) => (
                <div key={participant.id} className="workspace-roster-card">
                  <div className="workspace-avatar">
                    {participant.imageUrl ? (
                      <img src={participant.imageUrl} alt={participant.name} />
                    ) : (
                      <span>{participant.name.slice(0, 1).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <strong>{participant.name}</strong>
                    <p className="label-muted">
                      {participant.active ? 'Activo' : 'Inactivo'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="workspace-panel">
          <div className="page-header">
            <div>
              <p className="eyebrow">Rondas</p>
              <h2>Mapa operativo</h2>
            </div>
            <Link to={ROUTES.tournamentRounds.replace(':id', id)}>
              <Button variant="ghost">Abrir rondas</Button>
            </Link>
          </div>
          {rounds.length === 0 ? (
            <EmptyState
              title="Sin rondas"
              description="Crea la primera ronda para convertir el torneo en juego real."
            />
          ) : (
            <div className="workspace-round-list">
              {rounds.map((round) => (
                <Link
                  key={round.id}
                  to={ROUTES.roundDetail.replace(':id', round.id)}
                  className="workspace-round-card"
                >
                  <div>
                    <p className="eyebrow">Ronda {round.roundNumber}</p>
                    <strong>{round.name}</strong>
                  </div>
                  <Badge tone={round.status === 'OPEN' ? 'success' : 'neutral'}>
                    {round.status}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
