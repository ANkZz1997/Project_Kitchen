import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Product photos uploaded through the admin are served from /api/files,
  // so no remote image domains are needed.
  experimental: {
    serverActions: { bodySizeLimit: "20mb" },
  },
};

export default nextConfig;
