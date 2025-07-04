import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    // Видалив serverActions: true - воно включене за замовчуванням в Next.js 14+
    // Або можеш використовувати новий формат:
    // serverActions: {
    //   allowedOrigins: ['localhost:3000', '*.vercel.app']
    // }
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
  domains: ["uploadthing.com"],
  }
}

export default nextConfig;