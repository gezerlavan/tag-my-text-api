export function logger(level, ...args) {
  const timestamp = new Date().toISOString()
  console[level](`[${timestamp}]`, ...args)
}
