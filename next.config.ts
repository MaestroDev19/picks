import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/original/**",
      },
    ],
  },
  // Add allowedDevOrigins configuration to permit cross-origin requests
  allowedDevOrigins: [
    '172.16.0.197', // Allow requests from this specific IP
    // You can add more origins if needed, including wildcards
    // '*.local-network.dev',
  ],
};

export default nextConfig;
