/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    domains: [],
    unoptimized: process.env.NODE_ENV !== "production",
  },
};

module.exports = nextConfig;
