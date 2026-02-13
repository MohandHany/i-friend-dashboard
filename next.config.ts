import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow S3-hosted images used in the app
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i-friend.s3.eu-north-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
