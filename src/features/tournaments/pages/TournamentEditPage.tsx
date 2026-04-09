import { useNavigate, useParams } from 'react-router-dom'

import { PageError } from '@/components/feedback/PageError'
import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { toAppError } from '@/core/utils/errors'
import { TournamentForm } from '@/features/tournaments/components/TournamentForm'
import { TournamentWorkspaceNav } from '@/features/tournaments/components/TournamentWorkspaceNav'
import { useTournament } from '@/features/tournaments/hooks/useTournament'
import { useUpdateTournament } from '@/features/tournaments/hooks/useUpdateTournament'

export function TournamentEditPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const tournamentQuery = useTournament(id)
  const updateMutation = useUpdateTournament(id)

  if (tournamentQuery.isLoading) {
    return <Loader label="Cargando torneo..." />
  }

  if (tournamentQuery.isError || !tournamentQuery.data) {
    return <PageError message={toAppError(tournamentQuery.error).message} />
  }

  return (
    <div className="stack">
      <TournamentWorkspaceNav tournamentId={id} tournamentName={tournamentQuery.data.name} />
      <div>
        <p className="eyebrow">Configuracion</p>
        <h1>Ajustes del torneo</h1>
        <p>Actualiza la informacion base sin perder el contexto del workspace.</p>
      </div>
      <Card>
        {updateMutation.isError ? (
          <PageError message={toAppError(updateMutation.error).message} />
        ) : null}
        <TournamentForm
          initialValues={{
            title: tournamentQuery.data.title ?? tournamentQuery.data.name,
            type: tournamentQuery.data.type ?? 'POLL',
            description: tournamentQuery.data.description,
            accessMode: tournamentQuery.data.accessMode ?? 'ANONYMOUS',
            startAt: tournamentQuery.data.startAt,
            endAt: tournamentQuery.data.endAt,
          }}
          submitLabel="Guardar cambios"
          isSubmitting={updateMutation.isPending}
          onSubmit={(values) =>
            updateMutation.mutate(values, {
              onSuccess: () => navigate(`/tournaments/${id}`),
            })
          }
        />
      </Card>
    </div>
  )
}
