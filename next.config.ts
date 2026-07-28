import type { NextConfig } from "next";

const staticExport = process.env.NETLIFY_STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  output: staticExport ? "export" : undefined,
  trailingSlash: staticExport,
};

export default nextConfig;
