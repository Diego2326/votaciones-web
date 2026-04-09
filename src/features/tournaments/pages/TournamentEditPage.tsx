import { Navigate, useParams } from 'react-router-dom'

import { ROUTES } from '@/core/constants/routes'

export function TournamentEditPage() {
  const { id = '' } = useParams()

  return <Navigate to={ROUTES.tournamentRounds.replace(':id', id)} replace />
}
