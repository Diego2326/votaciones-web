import { z } from 'zod'

export const voteSchema = z.object({
  participantId: z.string().min(1, 'Selecciona una opcion para votar'),
})

export type VoteSchema = z.infer<typeof voteSchema>
