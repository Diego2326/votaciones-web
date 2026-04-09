import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useAuthStore } from '@/app/store/auth.store'
import { EmptyState } from '@/components/feedback/EmptyState'
import { PageError } from '@/components/feedback/PageError'
import { Badge } from '@/components/ui/Badge'
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
  useUpdateParticipant,
} from '@/features/participants/hooks/useParticipants'
import type { ParticipantPayload } from '@/features/participants/types/participant.types'
import { useTournament } from '@/features/tournaments/hooks/useTournament'
import { TournamentWorkspaceNav } from '@/features/tournaments/components/TournamentWorkspaceNav'
import { canManageTournament } from '@/features/tournaments/utils/ownership'
import { uploadImageToImgur } from '@/features/uploads/api/imgurApi'

export function ParticipantsPage() {
  const { id = '' } = useParams()
  const user = useAuthStore((state) => state.user)
  const [editingParticipantId, setEditingParticipantId] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const tournamentQuery = useTournament(id)
  const participantsQuery = useParticipants(id)
  const createMutation = useCreateParticipant(id)
  const deleteMutation = useDeleteParticipant(id)
  const updateMutation = useUpdateParticipant(id)

  if (participantsQuery.isLoading || tournamentQuery.isLoading) {
    return <Loader label="Cargando participantes..." />
  }

  if (participantsQuery.isError || tournamentQuery.isError || !tournamentQuery.data) {
    return <PageError message={toAppError(participantsQuery.error ?? tournamentQuery.error).message} />
  }

  const participants = participantsQuery.data ?? []
  const tournament = tournamentQuery.data

  if (!canManageTournament(user, tournament)) {
    return (
      <PageError
        title="No puedes administrar este torneo"
        message="Los organizadores solo pueden ver y editar torneos propios."
      />
    )
  }

  const editingParticipant =
    participants.find((participant) => participant.id === editingParticipantId) ?? null

  const handleSubmit = async (values: ParticipantPayload, imageFile: File | null) => {
    setSubmitError(null)

    try {
      let imageUrl = values.imageUrl ?? null

      if (imageFile) {
        setIsUploadingImage(true)
        imageUrl = await uploadImageToImgur(imageFile)
      }

      const payload: ParticipantPayload = {
        ...values,
        imageUrl,
      }

      if (editingParticipant) {
        await updateMutation.mutateAsync({ id: editingParticipant.id, payload })
        setEditingParticipantId(null)
        return
      }

      await createMutation.mutateAsync(payload)
    } catch (error) {
      setSubmitError(toAppError(error).message)
    } finally {
      setIsUploadingImage(false)
    }
  }

  return (
    <div className="stack">
      <TournamentWorkspaceNav tournamentId={id} tournamentName={tournament.name} />
      <div>
        <p className="eyebrow">Registro</p>
        <h1>Participantes del torneo</h1>
        <p>
          Construye la plantilla real del juego. Aqui subes fotos, activas perfiles y dejas lista
          la base para emparejar.
        </p>
      </div>
      <Card>
        {submitError ? (
          <PageError title="No se pudo guardar el participante" message={submitError} />
        ) : null}
        <ParticipantForm
          key={editingParticipant?.id ?? 'new'}
          initialValues={editingParticipant ?? undefined}
          submitLabel={editingParticipant ? 'Actualizar participante' : 'Guardar participante'}
          isSubmitting={createMutation.isPending || updateMutation.isPending || isUploadingImage}
          onCancel={editingParticipant ? () => setEditingParticipantId(null) : undefined}
          onSubmit={handleSubmit}
        />
      </Card>
      <Card>
        <div className="page-header">
          <div>
            <p className="eyebrow">Roster</p>
            <h2>Plantilla cargada</h2>
          </div>
          <Badge tone={participants.length > 0 ? 'success' : 'warning'}>
            {participants.length} participantes
          </Badge>
        </div>
        {participants.length === 0 ? (
          <EmptyState
            title="Sin participantes"
            description="Registra participantes para poder crear enfrentamientos."
          />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>Foto</TableCell>
                <TableCell header>Nombre</TableCell>
                <TableCell header>Descripcion</TableCell>
                <TableCell header>Estado</TableCell>
                <TableCell header>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>
                    {participant.imageUrl ? (
                      <img
                        src={participant.imageUrl}
                        alt={participant.name}
                        style={{
                          width: '48px',
                          height: '48px',
                          objectFit: 'cover',
                          borderRadius: '0.75rem',
                          border: '1px solid rgba(31, 41, 51, 0.12)',
                        }}
                      />
                    ) : (
                      'Sin foto'
                    )}
                  </TableCell>
                  <TableCell>{participant.name}</TableCell>
                  <TableCell>{participant.description ?? 'Sin descripcion'}</TableCell>
                  <TableCell>{participant.active ? 'Activo' : 'Inactivo'}</TableCell>
                  <TableCell>
                    <TableActions>
                      <Button
                        variant="secondary"
                        onClick={() => setEditingParticipantId(participant.id)}
                      >
                        Editar
                      </Button>
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
