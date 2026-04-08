import { useParams } from 'react-router-dom'

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
} from '@/features/rounds/hooks/useRounds'

export function RoundDetailPage() {
  const { id = '' } = useParams()
  const roundQuery = useRound(id)
  const openMutation = useOpenRound(id)
  const closeMutation = useCloseRound(id)
  const processMutation = useProcessRound(id)
  const publishMutation = usePublishRoundResults(id)

  if (roundQuery.isLoading) {
    return <Loader label="Cargando ronda..." />
  }

  if (roundQuery.isError || !roundQuery.data) {
    return <PageError message={toAppError(roundQuery.error).message} />
  }

  const round = roundQuery.data

  return (
    <Card>
      <div className="stack">
        <div className="page-header">
          <div>
            <p className="eyebrow">Ronda</p>
            <h1>{round.name}</h1>
          </div>
          <strong>{round.status}</strong>
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
        </div>
      </div>
    </Card>
  )
}
