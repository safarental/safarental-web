
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'aef8-2001-448a-20a2-117e-7975-5c70-d28d-3470.ngrok-free.app',
        port: '',
        pathname: '/**', // Allow any path from this hostname
      },
      {
        protocol: 'https',
        hostname: 'larger-gourmet-peninsula-tribal.trycloudflare.com',
        port: '',
        pathname: '/**', // Allow any path from this hostname
      }
    ],
  },
};

export default nextConfig;
