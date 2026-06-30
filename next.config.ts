import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/plan-calender',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
