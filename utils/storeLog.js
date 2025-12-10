import { db } from '../db/index.js'

export function storeLog(endpoint, input, output) {
  const stmt = db.prepare(`
    INSERT INTO ai_logs (endpoint, input, output, created_at)
    VALUES (?, ?, ?, ?)
  `)

  stmt.run(
    endpoint,
    JSON.stringify(input),
    JSON.stringify(output),
    new Date().toISOString()
  )
}
