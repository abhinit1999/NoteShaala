import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://checkout.razorpay.com https://connect.facebook.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://lh3.googleusercontent.com https://*.supabase.co https://www.facebook.com;
  font-src 'self' data:;
  object-src 'none';
  base-uri 'self';
  form-action 'self' https://checkout.razorpay.com;
  frame-ancestors 'none';
  frame-src 'self' https://api.razorpay.com/ https://checkout.razorpay.com/;
  connect-src 'self' https://*.supabase.co https://checkout.razorpay.com wss://*.supabase.co https://www.facebook.com;
  upgrade-insecure-requests;
`

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
