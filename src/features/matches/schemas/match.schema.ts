import { z } from 'zod'

export const matchSchema = z.object({
  participantAId: z.string().min(1, 'Selecciona el participante A'),
  participantBId: z.string().min(1, 'Selecciona el participante B'),
})

export type MatchSchema = z.infer<typeof matchSchema>
