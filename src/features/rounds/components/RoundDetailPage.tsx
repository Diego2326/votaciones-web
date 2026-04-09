import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { useAuthStore } from '@/app/store/auth.store'
import { EmptyState } from '@/components/feedback/EmptyState'
import { PageError } from '@/components/feedback/PageError'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { toAppError } from '@/core/utils/errors'
import {
  useCloseRound,
  useOpenRound,
  useProcessRound,
  usePublishRoundResults,
  useRound,
  useRoundResults,
} from '@/features/rounds/hooks/useRounds'
import { useTournament } from '@/features/tournaments/hooks/useTournament'
import { canManageTournament } from '@/features/tournaments/utils/ownership'

export function RoundDetailPage() {
  const { id = '' } = useParams()
  const user = useAuthStore((state) => state.user)
  const roundQuery = useRound(id)
  const resultsQuery = useRoundResults(id)
  const tournamentQuery = useTournament(roundQuery.data?.tournamentId ?? '')
  const openMutation = useOpenRound(id)
  const closeMutation = useCloseRound(id)
  const processMutation = useProcessRound(id)
  const publishMutation = usePublishRoundResults(id)

  if (roundQuery.isLoading || resultsQuery.isLoading || tournamentQuery.isLoading) {
    return <Loader label="Cargando ronda..." />
  }

  if (roundQuery.isError || resultsQuery.isError || tournamentQuery.isError || !roundQuery.data) {
    return (
      <PageError
        message={toAppError(roundQuery.error ?? resultsQuery.error ?? tournamentQuery.error).message}
      />
    )
  }

  const round = roundQuery.data

  if (!canManageTournament(user, tournamentQuery.data)) {
    return (
      <PageError
        title="No puedes administrar esta ronda"
        message="Los organizadores solo pueden ver rondas de torneos propios."
      />
    )
  }

  const results = resultsQuery.data

  return (
    <div className="stack">
      <Card>
        <div className="stack">
          <div className="page-header">
            <div>
              <p className="eyebrow">Ronda</p>
              <h1>{round.name}</h1>
              <p className="label-muted">
                #{round.roundNumber} · {round.opensAt ? `Abierta ${round.opensAt}` : 'Sin apertura'}
              </p>
            </div>
            <strong>{round.status}</strong>
          </div>
          <div className="inline-group">
            <Link to={`/tournaments/${round.tournamentId}/rounds`}>
              <Button variant="ghost">Volver a rondas</Button>
            </Link>
            <Link to={`/tournaments/${round.tournamentId}/presentation`} target="_blank" rel="noreferrer">
              <Button variant="secondary">Abrir presentacion</Button>
            </Link>
          </div>
          <div className="table-actions">
            <Button onClick={() => openMutation.mutate()} disabled={openMutation.isPending}>
              Abrir
            </Button>
            <Button onClick={() => closeMutation.mutate()} disabled={closeMutation.isPending}>
              Cerrar
            </Button>
            <Button onClick={() => processMutation.mutate()} disabled={processMutation.isPending}>
              Procesar
            </Button>
            <Button
              variant="secondary"
              onClick={() => publishMutation.mutate()}
              disabled={publishMutation.isPending}
            >
              Publicar resultados
            </Button>
            <Link to={`/rounds/${id}/matches`}>
              <Button variant="ghost">Ver matches</Button>
            </Link>
          </div>
        </div>
      </Card>
      <Card>
        <div className="stack">
          <div>
            <p className="eyebrow">Resultados</p>
            <h2>Estado de la ronda</h2>
          </div>
          {results && results.matches.length > 0 ? (
            results.matches.map((match) => (
              <div key={match.matchId} className="stack">
                <div className="split-line">
                  <strong>{match.matchId}</strong>
                  <span>{match.status}</span>
                </div>
                {match.results.map((entry) => (
                  <div key={entry.participantId} className="split-line">
                    <span>{entry.participantName}</span>
                    <span>{entry.votes} votos</span>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <EmptyState
              title="Sin resultados"
              description="Sin resultados."
            />
          )}
        </div>
      </Card>
    </div>
  )
}
