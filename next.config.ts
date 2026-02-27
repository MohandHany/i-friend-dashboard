import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i-friend.s3.eu-north-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
