/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "phinf.pstatic.net",
      "k.kakaocdn.net",
      "image.tmdb.org",
    ],
  },
};

module.exports = nextConfig;
