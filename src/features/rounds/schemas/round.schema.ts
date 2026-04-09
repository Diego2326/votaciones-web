import { z } from 'zod'

const optionalDateTimeSchema = z.string().trim().refine(
  (value) => value === '' || !Number.isNaN(new Date(value).getTime()),
  'La fecha debe ser valida',
)

export const roundSchema = z
  .object({
    name: z.string().min(2, 'La ronda necesita un nombre').max(120, 'Maximo 120 caracteres'),
    roundNumber: z.number().int().positive('El numero de ronda debe ser positivo'),
    opensAt: optionalDateTimeSchema,
    closesAt: optionalDateTimeSchema,
  })
  .refine(
    ({ opensAt, closesAt }) =>
      !opensAt || !closesAt || new Date(closesAt).getTime() >= new Date(opensAt).getTime(),
    {
      message: 'El cierre no puede ser antes de la apertura',
      path: ['closesAt'],
    },
  )

export type RoundSchema = z.infer<typeof roundSchema>
