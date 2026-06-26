import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async rewrites() {
    const apiUrl =
      process.env.API_URL ||
      (process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001'
        : 'http://localhost:3001'); // Use development default if API_URL not set
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
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
