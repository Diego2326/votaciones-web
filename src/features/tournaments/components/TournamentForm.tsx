import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormActions } from '@/components/forms/FormActions'
import {
  tournamentSchema,
  type TournamentSchema,
} from '@/features/tournaments/schemas/tournament.schema'
import type { TournamentPayload } from '@/features/tournaments/types/tournament.types'

interface TournamentFormProps {
  initialValues?: TournamentPayload
  submitLabel: string
  onSubmit: (values: TournamentPayload) => void
  isSubmitting?: boolean
}

export function TournamentForm({
  initialValues,
  submitLabel,
  onSubmit,
  isSubmitting = false,
}: TournamentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TournamentSchema>({
    resolver: zodResolver(tournamentSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      description: initialValues?.description ?? '',
    },
  })

  return (
    <form
      className="form-grid"
      onSubmit={handleSubmit((values) =>
        onSubmit({
          name: values.name,
          description: values.description?.trim() ? values.description : null,
        })
      )}
    >
      <Input id="name" label="Nombre del torneo" error={errors.name?.message} {...register('name')} />
      <Input
        id="description"
        label="Descripcion"
        error={errors.description?.message}
        {...register('description')}
      />
      <FormActions>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : submitLabel}
        </Button>
      </FormActions>
    </form>
  )
}
