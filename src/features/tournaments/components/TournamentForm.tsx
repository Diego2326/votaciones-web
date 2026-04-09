import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { FormActions } from '@/components/forms/FormActions'
import {
  tournamentSchema,
  type TournamentSchema,
} from '@/features/tournaments/schemas/tournament.schema'
import {
  TOURNAMENT_ACCESS_MODES,
  TOURNAMENT_TYPES,
  type TournamentPayload,
} from '@/features/tournaments/types/tournament.types'

interface TournamentFormInitialValues {
  title?: string
  type?: TournamentPayload['type']
  description?: string | null
  accessMode?: TournamentPayload['accessMode']
  startAt?: string | null | undefined
  endAt?: string | null | undefined
}

interface TournamentFormProps {
  initialValues?: TournamentFormInitialValues
  submitLabel: string
  onSubmit: (values: TournamentPayload) => void
  isSubmitting?: boolean
}

const tournamentTypeLabels = {
  ELIMINATION: 'Eliminacion',
  ROUND_BASED: 'Por rondas',
  POLL: 'Votacion',
  BRACKET: 'Bracket',
} as const

const accessModeLabels = {
  EMAIL_PASSWORD: 'Correo y contrasena',
  DISPLAY_NAME: 'Nombre visible',
  ANONYMOUS: 'Anonimo',
} as const

function toDateTimeLocalValue(value?: string | null) {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const pad = (part: number) => part.toString().padStart(2, '0')

  return [
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  ].join('T')
}

function toInstant(value: string) {
  if (!value.trim()) {
    return undefined
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return undefined
  }

  return date.toISOString()
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
      title: initialValues?.title ?? '',
      type: initialValues?.type ?? 'POLL',
      description: initialValues?.description ?? '',
      accessMode: initialValues?.accessMode ?? 'ANONYMOUS',
      startAt: toDateTimeLocalValue(initialValues?.startAt),
      endAt: toDateTimeLocalValue(initialValues?.endAt),
    },
  })

  return (
    <form
      className="form-grid columns-2"
      onSubmit={handleSubmit((values) => {
        const payload: TournamentPayload = {
          title: values.title.trim(),
          type: values.type,
          description: values.description?.trim() ? values.description.trim() : null,
          accessMode: values.accessMode,
        }

        const startAt = toInstant(values.startAt)
        const endAt = toInstant(values.endAt)

        if (startAt) {
          payload.startAt = startAt
        }

        if (endAt) {
          payload.endAt = endAt
        }

        onSubmit(payload)
      })}
    >
      <Input
        id="tournament-title"
        label="Titulo del torneo"
        error={errors.title?.message}
        {...register('title')}
      />
      <Select id="tournament-type" label="Tipo" error={errors.type?.message} {...register('type')}>
        {TOURNAMENT_TYPES.map((type) => (
          <option key={type} value={type}>
            {tournamentTypeLabels[type]}
          </option>
        ))}
      </Select>
      <Textarea
        id="tournament-description"
        label="Descripcion"
        error={errors.description?.message}
        rows={4}
        {...register('description')}
      />
      <Select
        id="tournament-access-mode"
        label="Modo de acceso"
        error={errors.accessMode?.message}
        {...register('accessMode')}
      >
        {TOURNAMENT_ACCESS_MODES.map((mode) => (
          <option key={mode} value={mode}>
            {accessModeLabels[mode]}
          </option>
        ))}
      </Select>
      <Input
        id="tournament-start-at"
        type="datetime-local"
        label="Inicio"
        error={errors.startAt?.message}
        {...register('startAt')}
      />
      <Input
        id="tournament-end-at"
        type="datetime-local"
        label="Cierre"
        error={errors.endAt?.message}
        {...register('endAt')}
      />
      <FormActions>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : submitLabel}
        </Button>
      </FormActions>
    </form>
  )
}
