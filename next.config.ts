import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "cdn.sanity.io",
      "titanscareers.com",
      "titanscareers.s3.amazonaws.com",
      "api.titanscareers.com",
      "titanscareers.s3.eu-north-1.amazonaws.com",
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "1024mb", // Increase limit to 100MB for video uploads
    },
  },
};

export default nextConfig;
