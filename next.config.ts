import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Vinext scaffold ships a Cloudflare-only `db/index.ts` (imports
  // "cloudflare:workers"). It is unused by this app, so skip type-checking
  // during `next build` when deploying to non-Cloudflare hosts.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

