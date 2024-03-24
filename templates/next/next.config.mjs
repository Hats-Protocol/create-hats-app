/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pino-pretty'],
  },
  images: {
    domains: ['ipfs.io'],
  },
};

export default nextConfig;
