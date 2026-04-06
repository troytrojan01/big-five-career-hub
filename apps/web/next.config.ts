import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@bigfive/content", "@bigfive/db"],
};

export default nextConfig;
