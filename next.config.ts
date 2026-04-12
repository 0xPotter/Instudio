import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export — emits the whole site to `out/` so Cloudflare
  // (or any static host) can serve it without a Node/Worker runtime.
  output: "export",
  // Required when using `output: "export"` — no on-demand image optimizer.
  // Picsum (and later Firebase Storage) already deliver via CDN.
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
      },
    ],
  },
};

export default nextConfig;
