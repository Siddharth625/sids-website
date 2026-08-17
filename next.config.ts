import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hides the floating Next.js dev-tools badge in the bottom-left
  // corner. Development-only chrome — it never shipped to production
  // either way, but it sat on top of the hero while working locally.
  devIndicators: false,
};

export default nextConfig;
