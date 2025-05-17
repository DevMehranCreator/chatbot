import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // در محیط توسعه، پراکسی به پورت 3000 (Next.js API)
    // در محیط تولید، پراکسی به دامنه اصلی (ورکال)
    return [
      {
        source: "/api/:path*",
        destination: process.env.NEXT_PUBLIC_API_BASE_URL
          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*`
          : "http://localhost:3000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
