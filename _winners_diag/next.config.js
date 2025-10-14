/** @type {import('next').NextConfig, images: { remotePatterns: [ { protocol: "https", hostname: "i.postimg.cc" }, { protocol: "https", hostname: "postimg.cc" } ] } } */
const nextConfig = { reactStrictMode: true , images: { remotePatterns: [ { protocol: "https", hostname: "i.postimg.cc" }, { protocol: "https", hostname: "postimg.cc" } ] } };
module.exports = nextConfig;

