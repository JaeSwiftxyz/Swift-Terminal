import type { NextConfig } from "next";

// API requests are proxied by web/app/api/[...path]/route.ts instead of a
// rewrite here, so the shared API key can be attached server-side. See
// web/lib/api-key.ts.
// The UI is served under /tools/terminal by default; change basePath here
// (and the fetch prefix in web/lib/api.ts) to serve it elsewhere.
const nextConfig: NextConfig = {
  output: "standalone",
  basePath: "/tools/terminal",
  trailingSlash: true,
};

export default nextConfig;
