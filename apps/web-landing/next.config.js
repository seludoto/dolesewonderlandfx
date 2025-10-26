/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    API_URL: process.env.API_URL || 'http://api.dolesewonderlandfx.me:31373',
    AUTH_API_URL: process.env.AUTH_API_URL || 'http://auth.dolesewonderlandfx.me:31282'
  }
}

module.exports = nextConfig