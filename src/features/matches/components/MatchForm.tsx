import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/Button'
import { FormActions } from '@/components/forms/FormActions'
import { Select } from '@/components/ui/Select'
import {
  matchSchema,
  type MatchSchema,
} from '@/features/matches/schemas/match.schema'
import type { MatchPayload } from '@/features/matches/types/match.types'

export function MatchForm({
  participantOptions,
  onSubmit,
  isSubmitting = false,
}: {
  participantOptions: Array<{ value: string; label: string }>
  onSubmit: (values: MatchPayload) => void
  isSubmitting?: boolean
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MatchSchema>({
    resolver: zodResolver(matchSchema),
    defaultValues: {
      participantAId: '',
      participantBId: '',
    },
  })

  return (
    <form className="form-grid columns-2" onSubmit={handleSubmit((values) => onSubmit(values))}>
      <Select
        id="participantAId"
        label="Participante A"
        error={errors.participantAId?.message}
        {...register('participantAId')}
      >
        <option value="">Selecciona</option>
        {participantOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Select
        id="participantBId"
        label="Participante B"
        error={errors.participantBId?.message}
        {...register('participantBId')}
      >
        <option value="">Selecciona</option>
        {participantOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <FormActions>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creando...' : 'Crear match'}
        </Button>
      </FormActions>
    </form>
  )
}
