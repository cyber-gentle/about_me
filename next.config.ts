import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
