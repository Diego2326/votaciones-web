import { z } from 'zod'

export const matchSchema = z
  .object({
    participantAId: z.string().min(1, 'Selecciona el participante A'),
    participantBId: z.string().min(1, 'Selecciona el participante B'),
  })
  .refine(({ participantAId, participantBId }) => participantAId !== participantBId, {
    message: 'Los participantes deben ser diferentes',
    path: ['participantBId'],
  })

export type MatchSchema = z.infer<typeof matchSchema>
