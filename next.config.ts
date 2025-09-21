import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async rewrites() {
    // Rewrites only for local environment
    if (process.env.ENVIRONMENT !== 'local') {
      return [];
    }
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL}/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'http.dog',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
