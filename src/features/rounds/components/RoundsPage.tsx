import { Link, useParams } from 'react-router-dom'

import { useAuthStore } from '@/app/store/auth.store'
import { EmptyState } from '@/components/feedback/EmptyState'
import { PageError } from '@/components/feedback/PageError'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { toAppError } from '@/core/utils/errors'
import { RoundForm } from '@/features/rounds/components/RoundForm'
import { useParticipants } from '@/features/participants/hooks/useParticipants'
import { useCreateRound, useGenerateRounds, useRounds } from '@/features/rounds/hooks/useRounds'
import { buildAutomaticRoundPlan } from '@/features/rounds/utils/automaticRounds'
import { TournamentForm } from '@/features/tournaments/components/TournamentForm'
import { useTournament } from '@/features/tournaments/hooks/useTournament'
import { useUpdateTournament } from '@/features/tournaments/hooks/useUpdateTournament'
import { TournamentWorkspaceNav } from '@/features/tournaments/components/TournamentWorkspaceNav'
import { canManageTournament } from '@/features/tournaments/utils/ownership'

export function RoundsPage() {
  const { id = '' } = useParams()
  const user = useAuthStore((state) => state.user)
  const tournamentQuery = useTournament(id)
  const roundsQuery = useRounds(id)
  const participantsQuery = useParticipants(id)
  const createMutation = useCreateRound(id)
  const generateMutation = useGenerateRounds(id)
  const updateTournamentMutation = useUpdateTournament(id)

  if (roundsQuery.isLoading || tournamentQuery.isLoading || participantsQuery.isLoading) {
    return <Loader label="Cargando rondas..." />
  }

  if (roundsQuery.isError || tournamentQuery.isError || participantsQuery.isError || !tournamentQuery.data) {
    return (
      <PageError
        message={toAppError(roundsQuery.error ?? tournamentQuery.error ?? participantsQuery.error).message}
      />
    )
  }

  const rounds = roundsQuery.data ?? []
  const tournament = tournamentQuery.data

  if (!canManageTournament(user, tournament)) {
    return (
      <PageError
        title="No puedes administrar este torneo"
        message="Los organizadores solo pueden ver y editar torneos propios."
      />
    )
  }

  const participants = participantsQuery.data ?? []
  const activeParticipants = participants.filter((participant) => participant.active)
  const automaticPlan = buildAutomaticRoundPlan(tournament, activeParticipants.length)
  const nextRoundNumber = rounds.length + 1

  return (
    <div className="stack">
      <TournamentWorkspaceNav tournamentId={id} tournamentName={tournament.name} />
      <div>
        <p className="eyebrow">Setup</p>
        <h1>Configuracion y rondas</h1>
        <p>
          Aqui ajustas el torneo y construyes su estructura base sin cambiar de pantalla.
        </p>
      </div>

      <Card className="workspace-panel">
        <div className="stack">
          <div>
            <p className="eyebrow">Configuracion base</p>
            <h2>Ajustes del torneo</h2>
            <p className="label-muted">
              Cambia titulo, tipo, acceso y ventana horaria antes de generar la estructura.
            </p>
          </div>
          {updateTournamentMutation.isError ? (
            <PageError
              title="No se pudo actualizar el torneo"
              message={toAppError(updateTournamentMutation.error).message}
            />
          ) : null}
          <TournamentForm
            initialValues={{
              title: tournament.title ?? tournament.name,
              type: tournament.type,
              description: tournament.description,
              accessMode: tournament.accessMode,
              startAt: tournament.startAt,
              endAt: tournament.endAt,
            }}
            submitLabel="Guardar configuracion"
            isSubmitting={updateTournamentMutation.isPending}
            onSubmit={(values) => updateTournamentMutation.mutate(values)}
          />
        </div>
      </Card>

      <Card className="workspace-panel">
        <div className="stack">
          <div className="page-header">
            <div>
              <p className="eyebrow">Generacion automatica</p>
              <h2>Estructura sugerida</h2>
            </div>
            {rounds.length === 0 ? (
              <Button
                disabled={generateMutation.isPending || automaticPlan.rounds.length === 0}
                onClick={() => generateMutation.mutate(automaticPlan.rounds)}
              >
                {generateMutation.isPending ? 'Generando...' : 'Generar rondas'}
              </Button>
            ) : (
              <Badge tone="success">Estructura creada</Badge>
            )}
          </div>

          <p className="label-muted">{automaticPlan.note}</p>

          <div className="workspace-kpis">
            <div className="workspace-kpi">
              <span className="metric-label">Tipo</span>
              <strong>{tournament.type}</strong>
              <span className="label-muted">Define la forma base</span>
            </div>
            <div className="workspace-kpi">
              <span className="metric-label">Participantes activos</span>
              <strong>{activeParticipants.length}</strong>
              <span className="label-muted">{participants.length} cargados en total</span>
            </div>
            <div className="workspace-kpi">
              <span className="metric-label">Rondas sugeridas</span>
              <strong>{automaticPlan.rounds.length}</strong>
              <span className="label-muted">Plantilla inicial</span>
            </div>
          </div>

          {automaticPlan.requirementMessage ? (
            <PageError
              title="Aun no se puede generar la estructura"
              message={automaticPlan.requirementMessage}
            />
          ) : null}

          {generateMutation.isError ? (
            <PageError
              title="No se pudo generar la estructura"
              message={toAppError(generateMutation.error).message}
            />
          ) : null}

          {rounds.length === 0 && automaticPlan.rounds.length > 0 ? (
            <div className="workflow-list">
              {automaticPlan.rounds.map((round) => (
                <div key={round.roundNumber} className="workflow-step">
                  <span className="workflow-step-number">{round.roundNumber}</span>
                  <div>
                    <strong>{round.name}</strong>
                    <p>
                      {round.opensAt
                        ? `Abre ${new Date(round.opensAt).toLocaleString()}`
                        : 'Sin ventana horaria definida'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </Card>

      <Card className="workspace-panel">
        <div className="stack">
          <div>
            <p className="eyebrow">Ajuste manual</p>
            <h2>Agregar una ronda extra</h2>
            <p className="label-muted">
              Si necesitas una excepcion a la estructura automatica, puedes crear rondas manuales.
            </p>
          </div>
          {createMutation.isError ? (
            <PageError
              title="No se pudo crear la ronda"
              message={toAppError(createMutation.error).message}
            />
          ) : null}
          <RoundForm
            defaultRoundNumber={nextRoundNumber}
            isSubmitting={createMutation.isPending}
            onSubmit={(values) => createMutation.mutate(values)}
          />
        </div>
      </Card>

      <div className="card-grid">
        {rounds.length === 0 ? (
          <Card>
            <EmptyState
              title="No hay rondas"
              description="Genera la estructura automatica o agrega una ronda manual para empezar."
            />
          </Card>
        ) : (
          rounds.map((round) => (
            <Card key={round.id} className="workspace-panel">
              <div className="stack">
                <div className="split-line">
                  <div>
                    <p className="eyebrow">Ronda {round.roundNumber}</p>
                    <h3>{round.name}</h3>
                    <p className="label-muted">
                      {round.opensAt ? `Abre ${round.opensAt}` : 'Sin apertura definida'}
                    </p>
                  </div>
                  <Badge tone={round.status === 'OPEN' ? 'success' : 'neutral'}>{round.status}</Badge>
                </div>
                <div className="inline-group">
                  <Link to={`/rounds/${round.id}`}>
                    <Button variant="secondary">Detalle</Button>
                  </Link>
                  <Link to={`/rounds/${round.id}/matches`}>
                    <Button>Matches</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
