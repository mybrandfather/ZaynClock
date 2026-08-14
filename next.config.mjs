/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: process.cwd(),
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      { source: '/world-clock', destination: '/worldclock', permanent: true },
      { source: '/time-converter', destination: '/converter', permanent: true },
      { source: '/timezone-converter', destination: '/converter', permanent: true },
      { source: '/timezones', destination: '/worldclock', permanent: true },
      { source: '/time-zones', destination: '/worldclock', permanent: true },
      { source: '/time-fromnow', destination: '/time-from-now', permanent: true },
      { source: '/privacy-policy', destination: '/privacy', permanent: true },
      { source: '/terms-of-service', destination: '/terms', permanent: true },
      { source: '/digital-clock', destination: '/', permanent: true },
      { source: '/analog-clock', destination: '/', permanent: true },
      { source: '/15-minute-timer', destination: '/timer?m=15', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
        ],
      },
    ]
  },
}

export default nextConfig
