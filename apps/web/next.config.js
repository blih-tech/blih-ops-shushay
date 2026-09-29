/** @type {import('next').NextConfig} */
const nextConfig = {
  // 'standalone' bundles all deps for minimal Docker images.
  // Remove if not deploying with Docker.
  output: process.env.DOCKER_BUILD === "true" ? "standalone" : undefined,
  transpilePackages: ["@blih/types", "@blih/validation", "@blih/api-client"],
  experimental: {
    externalDir: true,
  },
  async rewrites() {
    // In production, forward /api/* to the backend API service.
    // In development, the API runs on localhost:4000 directly.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      // Cloudinary — profile photos, logos, course thumbnails
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      // Google OAuth profile avatars
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      // Local API uploads (development)
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;
