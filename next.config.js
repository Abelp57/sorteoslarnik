/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const base = process.env.NEXT_PUBLIC_ADMIN_BASE_PATH || "/panel";
    return [
      { source: `${base}/:path*`, destination: `/admin/:path*` },
      // { source: `/api/panel/:path*`, destination: `/api/admin/:path*` }, // opcional
    ];
  },
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "no-referrer" },
        { key: "Permissions-Policy", value: "geolocation=()" },
        { key: "Content-Security-Policy",
          value:"default-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self' https:;" },
      ],
    }];
  },
};
module.exports = nextConfig;


