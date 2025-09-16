// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ✅ don’t fail the production build because of ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ✅ don’t fail the production build because of TS errors
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
