/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Force all API routes to use Node.js runtime
  async rewrites() {
    return []
  },
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    })
    return config
  },
  // Disable static optimization for pages that use email service
  unstable_runtimeJS: true,
  unstable_JsPreload: false,
}

export default nextConfig
