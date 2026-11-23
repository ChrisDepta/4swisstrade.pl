import type { NextConfig } from "next";
import { pageSlugs } from "./src/lib/routing";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/pl", destination: "/", permanent: true },
      { source: "/pl/:path+", destination: "/:path+", permanent: true },
      { source: "/o_nas", destination: "/o-nas", permanent: true },
    ];
  },
  async rewrites() {
    return [
      { source: "/", destination: "/pl" },
      ...pageSlugs.map((path) => ({
        source: `/${path}`,
        destination: `/pl/${path}`,
      })),
    ];
  },
};

export default nextConfig;
