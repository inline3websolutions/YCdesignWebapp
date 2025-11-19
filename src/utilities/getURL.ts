import canUseDOM from './canUseDOM'

export const getServerSideURL = () => {
  let url =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.RAILWAY_PUBLIC_DOMAIN ||
    ''

  // Add protocol if missing for Vercel/Railway domains
  if (url && !url.startsWith('http')) {
    url = `https://${url}`
  }

  // Fallback to localhost in development
  return url || 'http://localhost:3000'
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  return process.env.NEXT_PUBLIC_SERVER_URL || ''
}
