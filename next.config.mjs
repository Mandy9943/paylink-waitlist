/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Ensure these native/ESM deps are resolved at runtime on the server
    serverComponentsExternalPackages: [
      "@prisma/adapter-libsql",
      "@libsql/client",
      "libsql",
    ],
  },
  webpack: (config) => {
    // Allow accidental README.md imports (from dynamic contexts) to be treated as raw text
    config.module.rules.push({
      test: /README\.md$/,
      type: "asset/source",
    });
    return config;
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
}

export default nextConfig
