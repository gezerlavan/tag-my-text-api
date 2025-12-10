import express from 'express'
import { analyzeTone } from '../ai.js'
import { logger } from '../utils/logger.js'
import { storeLog } from '../utils/storeLog.js'
import { toneSchema } from '../validation/toneSchema.js'

export const toneRouter = express.Router()

toneRouter.post('/', async (req, res) => {
  const parsed = toneSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors })
  }

  const { text } = parsed.data

  try {
    const result = await analyzeTone(text)
    logger('info', 'Tone analysis:', result)
    storeLog('tone', { text }, result)
    res.json(result)
  } catch (err) {
    logger('error', 'Tone error:', err)
    res.status(500).json({ error: 'Tone analysis failed' })
  }
})
