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
    AUTH_API_URL: process.env.AUTH_API_URL || 'https://auth.dolesewonderlandfx.me',
    BACKTESTER_URL: process.env.BACKTESTER_URL || 'https://backtester.dolesewonderlandfx.me',
    AI_URL: process.env.AI_URL || 'https://ai.dolesewonderlandfx.me',
    SOCIAL_TRADING_URL: process.env.SOCIAL_TRADING_URL || 'https://social.dolesewonderlandfx.me',
    PAPER_TRADING_URL: process.env.PAPER_TRADING_URL || 'https://paper.dolesewonderlandfx.me'
  }
}

module.exports = nextConfig