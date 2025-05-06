export * from './routes'

export const BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:1337'
    : window.location.origin
