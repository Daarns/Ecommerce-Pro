/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        port: '',
        pathname: '/**',
      }
    ],
    // Alternative legacy approach (simpler but less secure)
    // domains: ['images.unsplash.com', 'plus.unsplash.com', 'unsplash.com'],
  },
  
  // Optional: Add other optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Optional: Compression and performance
  compress: true,
  
  // Optional: Strict mode
  reactStrictMode: true,
}

export default nextConfig;