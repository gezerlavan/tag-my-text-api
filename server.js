// server.js
import 'dotenv/config'
import express from 'express'
import { config } from './config/index.js'
import { tagRouter } from './routes/tag.js'

const app = express()
app.use(express.json())

app.use('/tag', tagRouter)

app.listen(config.port, () => {
  console.log(`API running on http://localhost:${config.port}`)
})
