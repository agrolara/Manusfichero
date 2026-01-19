/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configurar para servir la app Expo como web
  webpack: (config, { isServer }) => {
    return config;
  },
};

module.exports = nextConfig;
