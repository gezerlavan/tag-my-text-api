import express from 'express'
import { generateTags } from '../ai.js'
import { logger } from '../utils/logger.js'
import { storeLog } from '../utils/storeLog.js'

export const tagRouter = express.Router()

tagRouter.post('/', async (req, res) => {
  const { text } = req.body

  if (typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: 'text must be a non-empty string' })
  }

  try {
    const tags = await generateTags(text)
    logger('info', 'Generated tags:', tags)
    storeLog('tag', { text }, { tags })
    res.json({ tags })
  } catch (err) {
    logger('error', 'Tag error:', err)
    res.status(500).json({ error: 'Tag generation failed' })
  }
})
