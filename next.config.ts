import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Ensure Turbopack uses this project as the root to pick correct node_modules/.prisma
    root: __dirname,
  },
};

export default nextConfig;
