import { useEffect } from 'react'
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
  defaultRoundNumber = 1,
}: {
  onSubmit: (values: RoundPayload) => void
  isSubmitting?: boolean
  defaultRoundNumber?: number
}) {
  const toInstant = (value: string) => {
    if (!value.trim()) {
      return undefined
    }

    const parsed = new Date(value)

    if (Number.isNaN(parsed.getTime())) {
      return undefined
    }

    return parsed.toISOString()
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoundSchema>({
    resolver: zodResolver(roundSchema),
    defaultValues: {
      name: '',
      roundNumber: defaultRoundNumber,
      opensAt: '',
      closesAt: '',
    },
  })

  useEffect(() => {
    reset({
      name: '',
      roundNumber: defaultRoundNumber,
      opensAt: '',
      closesAt: '',
    })
  }, [defaultRoundNumber, reset])

  return (
    <form
      className="form-grid columns-2"
      onSubmit={handleSubmit((values) => {
        const payload: RoundPayload = {
          name: values.name,
          roundNumber: values.roundNumber,
        }

        const opensAt = toInstant(values.opensAt)
        const closesAt = toInstant(values.closesAt)

        if (opensAt) {
          payload.opensAt = opensAt
        }

        if (closesAt) {
          payload.closesAt = closesAt
        }

        onSubmit(payload)
      })}
    >
      <Input id="round-name" label="Nombre" error={errors.name?.message} {...register('name')} />
      <Input
        id="round-number"
        type="number"
        label="Numero de ronda"
        error={errors.roundNumber?.message}
        {...register('roundNumber', { valueAsNumber: true })}
      />
      <Input
        id="round-opens-at"
        type="datetime-local"
        label="Apertura"
        error={errors.opensAt?.message}
        {...register('opensAt')}
      />
      <Input
        id="round-closes-at"
        type="datetime-local"
        label="Cierre"
        error={errors.closesAt?.message}
        {...register('closesAt')}
      />
      <FormActions>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creando...' : 'Crear ronda'}
        </Button>
      </FormActions>
    </form>
  )
}
