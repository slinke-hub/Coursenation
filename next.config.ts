import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Explicitly disable x-powered-by header
  poweredByHeader: false,
  // Ensure strict mode is on
  reactStrictMode: true,
  // Ensure trailing slash behavior is standard (false is default but being explicit helps)
  trailingSlash: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
