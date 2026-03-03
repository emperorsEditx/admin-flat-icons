/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    // Temporarily ignore ESLint errors during production builds so we can upload quickly.
    ignoreDuringBuilds: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};
