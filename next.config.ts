import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "cdn.sanity.io",
      "titanscareers.com",
      "titanscareers.s3.amazonaws.com",
    ],
  },
};

export default nextConfig;
