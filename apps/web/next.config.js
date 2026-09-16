/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@blih/types", "@blih/validation", "@blih/api-client"],
  experimental: {
    externalDir: true,
  },
};

module.exports = nextConfig;
