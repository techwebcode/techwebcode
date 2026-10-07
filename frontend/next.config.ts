import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/tools/url-encoder",
        destination: "/tools/url-encoder-decoder",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
