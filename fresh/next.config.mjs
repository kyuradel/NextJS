/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'assets.vercel.com',
        },
        {
          protocol: 'https',
          hostname: 'nextjs.org',
        },
        {
            protocol: 'https',
            hostname: 'vercel.com',
        },
      ],
    },
};

export default nextConfig;
