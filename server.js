// server.js
import 'dotenv/config'
import express from 'express'
import { config } from './config/index.js'
import { rateLimit } from './middleware/rateLimit.js'
import { historyRouter } from './routes/history.js'
import { tagRouter } from './routes/tag.js'
import { toneRouter } from './routes/tone.js'

const app = express()
app.use(express.json())

app.use('/tag', rateLimit({ max: 15, windowMs: 60000 }), tagRouter)
app.use('/tone', rateLimit({ max: 15, windowMs: 60000 }), toneRouter)
app.use('/history', historyRouter)

app.listen(config.port, () => {
  console.log(`API running on http://localhost:${config.port}`)
})
