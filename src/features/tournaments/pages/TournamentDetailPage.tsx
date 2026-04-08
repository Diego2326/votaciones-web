import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'

import { EmptyState } from '@/components/feedback/EmptyState'
import { PageError } from '@/components/feedback/PageError'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { Tabs } from '@/components/ui/Tabs'
import { toAppError } from '@/core/utils/errors'
import { useParticipants } from '@/features/participants/hooks/useParticipants'
import { useRounds } from '@/features/rounds/hooks/useRounds'
import { useTournament } from '@/features/tournaments/hooks/useTournament'
import { tournamentApi } from '@/features/tournaments/api/tournamentApi'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTournamentLiveUpdates } from '@/features/websocket/hooks/useTournamentLiveUpdates'

export function TournamentDetailPage() {
  const { id = '' } = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const tournamentQuery = useTournament(id)
  const participantsQuery = useParticipants(id)
  const roundsQuery = useRounds(id)
  const queryClient = useQueryClient()
  const event = useTournamentLiveUpdates(id)

  const actionMutation = useMutation({
    mutationFn: async (action: 'publish' | 'activate' | 'close') => {
      switch (action) {
        case 'publish':
          return tournamentApi.publish(id)
        case 'activate':
          return tournamentApi.activate(id)
        case 'close':
          return tournamentApi.close(id)
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tournaments', id] })
      void queryClient.invalidateQueries({ queryKey: ['tournaments'] })
    },
  })

  if (tournamentQuery.isLoading) {
    return <Loader label="Cargando detalle del torneo..." />
  }

  if (tournamentQuery.isError || !tournamentQuery.data) {
    return <PageError message={toAppError(tournamentQuery.error).message} />
  }

  const tournament = tournamentQuery.data

  return (
    <div className="stack">
      <Card>
        <div className="page-header">
          <div>
            <p className="eyebrow">Detalle</p>
            <h1>{tournament.name}</h1>
            <p>{tournament.description}</p>
          </div>
          <Badge tone={tournament.active ? 'success' : 'warning'}>{tournament.status}</Badge>
        </div>
        <div className="table-actions">
          <Button onClick={() => actionMutation.mutate('publish')}>Publicar</Button>
          <Button variant="secondary" onClick={() => actionMutation.mutate('activate')}>
            Activar
          </Button>
          <Button variant="danger" onClick={() => actionMutation.mutate('close')}>
            Cerrar
          </Button>
          <Link to={`/tournaments/${id}/participants`}>
            <Button variant="ghost">Participantes</Button>
          </Link>
          <Link to={`/tournaments/${id}/rounds`}>
            <Button variant="ghost">Rondas</Button>
          </Link>
        </div>
        {event ? (
          <div className="label-muted">
            Evento en tiempo real: {event.type} · {event.emittedAt}
          </div>
        ) : null}
      </Card>
      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        options={[
          { value: 'overview', label: 'Resumen' },
          { value: 'participants', label: 'Participantes' },
          { value: 'rounds', label: 'Rondas' },
        ]}
      />
      {activeTab === 'overview' ? (
        <div className="stats-grid">
          <Card>
            <p className="metric-label">Participantes</p>
            <p className="metric-value">{participantsQuery.data?.length ?? 0}</p>
          </Card>
          <Card>
            <p className="metric-label">Rondas</p>
            <p className="metric-value">{roundsQuery.data?.length ?? 0}</p>
          </Card>
          <Card>
            <p className="metric-label">Estado</p>
            <p className="metric-value">{tournament.status}</p>
          </Card>
        </div>
      ) : null}
      {activeTab === 'participants' ? (
        <Card>
          {(participantsQuery.data ?? []).length === 0 ? (
            <EmptyState
              title="Sin participantes"
              description="Aun no se han registrado participantes en este torneo."
            />
          ) : (
            <div className="stack">
              {participantsQuery.data?.map((participant) => (
                <div key={participant.id} className="split-line">
                  <span>{participant.name}</span>
                  <span>{participant.seed ?? '-'}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      ) : null}
      {activeTab === 'rounds' ? (
        <Card>
          {(roundsQuery.data ?? []).length === 0 ? (
            <EmptyState
              title="Sin rondas"
              description="Crea una ronda para empezar a generar brackets y matches."
            />
          ) : (
            <div className="stack">
              {roundsQuery.data?.map((round) => (
                <div key={round.id} className="split-line">
                  <div>
                    <strong>{round.name}</strong>
                    <div className="label-muted">{round.status}</div>
                  </div>
                  <Link to={`/rounds/${round.id}`}>
                    <Button variant="secondary">Ver</Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>
      ) : null}
    </div>
  )
}
