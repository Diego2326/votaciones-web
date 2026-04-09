import { z } from 'zod'

export const participantSchema = z.object({
  name: z.string().min(2, 'Ingresa un nombre').max(160, 'Maximo 160 caracteres'),
  description: z.string().max(4000, 'Maximo 4000 caracteres'),
  active: z.enum(['true', 'false']),
})

export type ParticipantSchema = z.infer<typeof participantSchema>
