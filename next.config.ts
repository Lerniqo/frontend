import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  trailingSlash: true,
  images: {
    unoptimized: false,
  },
  reactStrictMode: true,
};

export default nextConfig;
