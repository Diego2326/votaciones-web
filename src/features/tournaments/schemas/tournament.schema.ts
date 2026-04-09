import { z } from 'zod'

import {
  TOURNAMENT_ACCESS_MODES,
  TOURNAMENT_TYPES,
} from '@/features/tournaments/types/tournament.types'

const optionalDateTimeSchema = z.string().trim().refine(
  (value) => value === '' || !Number.isNaN(new Date(value).getTime()),
  'La fecha debe ser valida',
)

export const tournamentSchema = z
  .object({
    title: z.string().trim().min(1, 'El torneo necesita un titulo').max(160, 'Maximo 160 caracteres'),
    type: z.enum(TOURNAMENT_TYPES),
    description: z.string().max(4000, 'Maximo 4000 caracteres'),
    accessMode: z.enum(TOURNAMENT_ACCESS_MODES),
    startAt: optionalDateTimeSchema,
    endAt: optionalDateTimeSchema,
  })
  .refine(
    ({ startAt, endAt }) =>
      !startAt || !endAt || new Date(endAt).getTime() >= new Date(startAt).getTime(),
    {
      message: 'La fecha de cierre no puede ser anterior al inicio',
      path: ['endAt'],
    },
  )

export type TournamentSchema = z.infer<typeof tournamentSchema>
