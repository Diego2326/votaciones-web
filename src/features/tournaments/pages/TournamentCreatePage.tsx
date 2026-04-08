import { useNavigate } from 'react-router-dom'

import { PageError } from '@/components/feedback/PageError'
import { Card } from '@/components/ui/Card'
import { toAppError } from '@/core/utils/errors'
import { TournamentForm } from '@/features/tournaments/components/TournamentForm'
import { useCreateTournament } from '@/features/tournaments/hooks/useCreateTournament'

export function TournamentCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreateTournament()

  return (
    <div className="stack">
      <div>
        <p className="eyebrow">Nuevo</p>
        <h1>Crear torneo</h1>
      </div>
      <Card>
        {createMutation.isError ? (
          <PageError message={toAppError(createMutation.error).message} />
        ) : null}
        <TournamentForm
          submitLabel="Crear torneo"
          isSubmitting={createMutation.isPending}
          onSubmit={(values) =>
            createMutation.mutate(values, {
              onSuccess: (tournament) => navigate(`/tournaments/${tournament.id}`),
            })
          }
        />
      </Card>
    </div>
  )
}
