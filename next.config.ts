import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['jnhermjdruqicgilhnxb.supabase.co'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jnhermjdruqicgilhnxb.supabase.co",
        pathname: '/storage/v1/object/public/public-thumbnails/**',
      },
    ],
  },
};

export default nextConfig;
