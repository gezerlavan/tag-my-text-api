export const config = {
  port: process.env.PORT || 3000,
  model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  logLevel: process.env.LOG_LEVEL || 'info',
}
