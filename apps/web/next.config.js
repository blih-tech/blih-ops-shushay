/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@blih/types", "@blih/validation", "@blih/api-client"],
  experimental: {
    externalDir: true,
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
