import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  serverExternalPackages: ["qrcode"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
