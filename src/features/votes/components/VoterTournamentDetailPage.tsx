import { Link, useParams } from 'react-router-dom'

import { PageError } from '@/components/feedback/PageError'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { toAppError } from '@/core/utils/errors'
import { useTournament } from '@/features/tournaments/hooks/useTournament'

export function VoterTournamentDetailPage() {
  const { id = '' } = useParams()
  const tournamentQuery = useTournament(id)

  if (tournamentQuery.isLoading) {
    return <Loader label="Cargando torneo..." />
  }

  if (tournamentQuery.isError || !tournamentQuery.data) {
    return <PageError message={toAppError(tournamentQuery.error).message} />
  }

  const tournament = tournamentQuery.data

  return (
    <Card>
      <div className="stack">
        <div>
          <p className="eyebrow">Torneo</p>
          <h1>{tournament.name}</h1>
          <p>{tournament.description}</p>
        </div>
        <Link to={`/vote/rounds/${tournament.id}`}>
          <Button>Ver ronda actual</Button>
        </Link>
      </div>
    </Card>
  )
}
