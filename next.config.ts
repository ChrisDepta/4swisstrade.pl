import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    const legacy = ["serwis", "serwis-centralny-4swiss", "ekspresy", "kontakt", "o-nas"];
    return [
      { source: "/", destination: "/pl", permanent: true },
      ...legacy.map((path) => ({
        source: `/${path}`,
        destination: `/pl/${path}`,
        permanent: true,
      })),
      { source: "/o_nas", destination: "/pl/o-nas", permanent: true },
    ];
  },
};

export default nextConfig;
