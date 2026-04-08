import { useParams } from 'react-router-dom'

import { EmptyState } from '@/components/feedback/EmptyState'
import { PageError } from '@/components/feedback/PageError'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import {
  Table,
  TableActions,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/components/ui/Table'
import { toAppError } from '@/core/utils/errors'
import { ParticipantForm } from '@/features/participants/components/ParticipantForm'
import {
  useCreateParticipant,
  useDeleteParticipant,
  useParticipants,
} from '@/features/participants/hooks/useParticipants'

export function ParticipantsPage() {
  const { id = '' } = useParams()
  const participantsQuery = useParticipants(id)
  const createMutation = useCreateParticipant(id)
  const deleteMutation = useDeleteParticipant(id)

  if (participantsQuery.isLoading) {
    return <Loader label="Cargando participantes..." />
  }

  if (participantsQuery.isError) {
    return <PageError message={toAppError(participantsQuery.error).message} />
  }

  const participants = participantsQuery.data ?? []

  return (
    <div className="stack">
      <div>
        <p className="eyebrow">Registro</p>
        <h1>Participantes</h1>
      </div>
      <Card>
        <ParticipantForm
          isSubmitting={createMutation.isPending}
          onSubmit={(values) => createMutation.mutate(values)}
        />
      </Card>
      <Card>
        {participants.length === 0 ? (
          <EmptyState
            title="Sin participantes"
            description="Registra participantes para poder crear enfrentamientos."
          />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>Nombre</TableCell>
                <TableCell header>Seed</TableCell>
                <TableCell header>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>{participant.name}</TableCell>
                  <TableCell>{participant.seed ?? '-'}</TableCell>
                  <TableCell>
                    <TableActions>
                      <Button
                        variant="danger"
                        onClick={() => deleteMutation.mutate(participant.id)}
                      >
                        Eliminar
                      </Button>
                    </TableActions>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
