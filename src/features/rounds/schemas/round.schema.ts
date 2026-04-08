import { z } from 'zod'

export const roundSchema = z.object({
  name: z.string().min(2, 'La ronda necesita un nombre'),
  sequence: z.number().int().positive('La secuencia debe ser positiva'),
})

export type RoundSchema = z.infer<typeof roundSchema>
