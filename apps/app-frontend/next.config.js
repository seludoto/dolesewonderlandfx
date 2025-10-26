/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    API_URL: process.env.API_URL || 'https://api.dolesewonderlandfx.me',
    AUTH_API_URL: process.env.AUTH_API_URL || 'https://auth.dolesewonderlandfx.me'
  }
}

module.exports = nextConfig