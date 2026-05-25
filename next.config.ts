import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/website_Exercise1_Bootcamp",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
