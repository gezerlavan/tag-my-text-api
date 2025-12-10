import express from 'express'
import { analyzeTone } from '../ai.js'
import { logger } from '../utils/logger.js'
import { storeLog } from '../utils/storeLog.js'

export const toneRouter = express.Router()

toneRouter.post('/', async (req, res) => {
  const { text } = req.body

  if (typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: 'text must be a non-empty string' })
  }

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
