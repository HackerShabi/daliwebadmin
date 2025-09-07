/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Admin API routes stay local (handled by this Next.js app)
      // No rewrite needed for /api/admin/* routes
      
      // Only rewrite non-admin API routes to backend server
      {
        source: '/api/((?!admin).*)/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://daliwebagencybackend.onrender.com'}/api/$1/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;