/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding"); // Rainbowkit polyfills

    return config;
  },
  images: {
    domains: ["ipfs.io"],
  },
};

export default nextConfig;
