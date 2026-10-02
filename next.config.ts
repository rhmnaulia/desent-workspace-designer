import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // ~10 kB of Tailwind CSS ships inside the HTML instead of a separate,
    // render-blocking request. Most visitors arrive once, from a link, so a
    // saved round trip beats a cached stylesheet. Measured on production.
    inlineCss: true,
  },
  images: {
    // Product photos come straight from monis.rent's image host (the brief allows reusing them).
    remotePatterns: [new URL("https://strapi.monis.rent/uploads/**")],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
