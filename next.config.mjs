/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs', 'sharp'],
  },
  async redirects() {
    return [
      {
        source: '/pricing',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/portfolio',
        destination: '/services',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
