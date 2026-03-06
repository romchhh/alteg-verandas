import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Enable image optimization (automatically converts to WebP when supported)
    formats: ['image/webp', 'image/avif'],
    // Optimize images from uploads directory
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'alu-ams.de',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
