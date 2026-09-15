import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Dev server is reached via 127.0.0.1 / the Caddy proxy (Caddyfile) in
  // addition to plain localhost — Next.js blocks cross-origin dev asset
  // requests (403) from hosts not in this list. See
  // node_modules/next/dist/docs/.../allowedDevOrigins.md.
  allowedDevOrigins: ["127.0.0.1", "*.localhost"],
};

export default nextConfig;
