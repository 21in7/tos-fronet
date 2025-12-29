import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    // 외부 이미지 도메인 허용
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'r2.gihyeonofsoul.com',
        port: '',
        pathname: '/**',
      },
    ],
    // 빠른 로딩을 위한 설정  
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // 외부 API 호출을 위한 설정
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
  // API 프록시 설정
  async rewrites() {
    const apiServerUrl = process.env.API_SERVER_URL || 'http://192.168.50.224:3000';

    return [
      {
        source: '/api/:path*',
        destination: `${apiServerUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
