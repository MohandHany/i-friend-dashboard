import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,

  images: {
    domains: ["i-friend.s3.eu-north-1.amazonaws.com"],
  },
};

export default nextConfig;
