import { z } from 'zod'

export const tournamentSchema = z.object({
  name: z.string().min(3, 'El torneo necesita un nombre'),
  description: z.string().max(500, 'La descripcion es demasiado larga').optional(),
})

export type TournamentSchema = z.infer<typeof tournamentSchema>
