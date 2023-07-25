/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'phinf.pstatic.net',
      'k.kakaocdn.net',
      'image.tmdb.org',
    ],
  },
  modularizeImports: {
    '@phosphor-icons/react': {
      transform: '@phosphor-icons/react/{{member}}',
    },
  },
  experimental: {
    scrollRestoration: true,
  },
};

module.exports = nextConfig;
