import { z } from 'zod'

export const tagSchema = z.object({
  text: z.string().min(1).max(5000),
})
