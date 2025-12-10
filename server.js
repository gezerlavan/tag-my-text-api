// server.js
import 'dotenv/config'
import express from 'express'
import { generateTags } from './ai.js'

const app = express()
app.use(express.json())

app.post('/tag', async (req, res) => {
  const { text } = req.body

  if (!text) {
    return res.status(400).json({ error: 'text field is required' })
  }

  try {
    const tags = await generateTags(text)
    return res.json({ tags })
  } catch (err) {
    console.error('AI error:', err)
    return res.status(500).json({ error: 'Tag generation failed' })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})
