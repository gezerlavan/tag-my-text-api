import { logger } from '../utils/logger.js'

const rateMap = new Map()

export function rateLimit({ windowMs = 60000, max = 10 } = {}) {
  return (req, res, next) => {
    const ip = req.ip

    const now = Date.now()
    const windowStart = now - windowMs

    // Create bucket if none exists
    if (!rateMap.has(ip)) {
      rateMap.set(ip, [])
    }

    // Remove old timestamps
    const timestamps = rateMap.get(ip).filter(ts => ts > windowStart)

    // Update the map
    rateMap.set(ip, timestamps)

    // Enforce limit
    if (timestamps.length >= max) {
      logger('warn', `Rate limit hit for IP ${ip}`)
      return res.status(429).json({
        error: 'Rate limit exceeded. Try again later.',
      })
    }

    // Add current timestamp
    timestamps.push(now)
    rateMap.set(ip, timestamps)

    next()
  }
}
