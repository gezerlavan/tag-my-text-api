import { z } from 'zod'

export const toneSchema = z.object({
  text: z.string().min(1).max(5000),
})
