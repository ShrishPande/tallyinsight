/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  assetPrefix: './',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  env: {
    // Pass environment variables to the client side if needed, 
    // though Next.js handles NEXT_PUBLIC_ automatically.
    // We'll keep the existing ones for compatibility if they are used without NEXT_PUBLIC_ prefix in the code (via process.env).
    // However, Next.js requires NEXT_PUBLIC_ for client-side access.
    // The existing code uses process.env.GEMINI_API_KEY. 
    // We should ideally rename it, but for now we can expose it here or rely on server-side usage if possible.
    // Since App.tsx is client-side, we need to be careful.
    // Let's assume we will migrate env vars properly or expose them here.
  },
};

export default nextConfig;
