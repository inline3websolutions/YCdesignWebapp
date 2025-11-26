import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

// const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
//   ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
//   : undefined || process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
let serverPattern = null

if (serverUrl) {
  try {
    const parsed = new URL(serverUrl)
    serverPattern = { hostname: parsed.hostname, protocol: parsed.protocol.replace(':', '') }
  } catch (e) {
    // invalid URL in env — ignore or log
    serverPattern = null
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'localhost', protocol: 'http' },
      ...(serverPattern ? [serverPattern] : []),
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
  // Ensure clean builds on each deployment
  generateBuildId: async () => {
    return `build-${Date.now()}`
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
