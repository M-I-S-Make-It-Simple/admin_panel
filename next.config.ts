import type { NextConfig } from "next";
// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', 
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig