import { z } from 'zod'

export const participantSchema = z.object({
  name: z.string().min(2, 'Ingresa un nombre'),
  description: z.string().optional(),
  seed: z.number().int().positive('El seed debe ser positivo').optional(),
})

export type ParticipantSchema = z.infer<typeof participantSchema>
