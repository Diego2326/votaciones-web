import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormActions } from '@/components/forms/FormActions'
import {
  roundSchema,
  type RoundSchema,
} from '@/features/rounds/schemas/round.schema'
import type { RoundPayload } from '@/features/rounds/types/round.types'

export function RoundForm({
  onSubmit,
  isSubmitting = false,
}: {
  onSubmit: (values: RoundPayload) => void
  isSubmitting?: boolean
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoundSchema>({
    resolver: zodResolver(roundSchema),
    defaultValues: {
      name: '',
      sequence: 1,
    },
  })

  return (
    <form
      className="form-grid columns-2"
      onSubmit={handleSubmit((values) =>
        onSubmit({
          name: values.name,
          sequence: values.sequence,
        })
      )}
    >
      <Input id="round-name" label="Nombre" error={errors.name?.message} {...register('name')} />
      <Input
        id="round-sequence"
        type="number"
        label="Secuencia"
        error={errors.sequence?.message}
        {...register('sequence', { valueAsNumber: true })}
      />
      <FormActions>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creando...' : 'Crear ronda'}
        </Button>
      </FormActions>
    </form>
  )
}
