import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormActions } from '@/components/forms/FormActions'
import {
  participantSchema,
  type ParticipantSchema,
} from '@/features/participants/schemas/participant.schema'
import type { ParticipantPayload } from '@/features/participants/types/participant.types'

export function ParticipantForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
}: {
  initialValues?: ParticipantPayload
  onSubmit: (values: ParticipantPayload) => void
  isSubmitting?: boolean
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParticipantSchema>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      description: initialValues?.description ?? '',
      seed: initialValues?.seed ?? undefined,
    },
  })

  return (
    <form
      className="form-grid columns-2"
      onSubmit={handleSubmit((values) => {
        const payload: ParticipantPayload = {
          name: values.name,
          description: values.description?.trim() ? values.description : null,
        }

        if (typeof values.seed === 'number' && Number.isFinite(values.seed)) {
          payload.seed = values.seed
        }

        onSubmit(payload)
      })}
    >
      <Input id="participant-name" label="Nombre" error={errors.name?.message} {...register('name')} />
      <Input
        id="participant-description"
        label="Descripcion"
        error={errors.description?.message}
        {...register('description')}
      />
      <Input
        id="participant-seed"
        type="number"
        label="Seed"
        error={errors.seed?.message}
        {...register('seed', { valueAsNumber: true })}
      />
      <FormActions>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar participante'}
        </Button>
      </FormActions>
    </form>
  )
}
