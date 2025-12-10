import express from 'express'
import { db } from '../db/index.js'

export const historyRouter = express.Router()

historyRouter.get('/', (req, res) => {
  const rows = db
    .prepare(
      `
      SELECT endpoint, input, output, created_at
      FROM ai_logs
      ORDER BY id DESC
      LIMIT 20
    `
    )
    .all()

  res.json({ history: rows })
})
