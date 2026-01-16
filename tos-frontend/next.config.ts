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
  // trailingSlash 설정 - Django REST Framework 호환
  trailingSlash: true,

  // API 프록시 설정 - CORS 문제를 해결하기 위해 Next.js에서 프록시
  async rewrites() {
    const apiServerUrl = process.env.API_SERVER_URL || 'https://gihyeonofsoul.com';
    console.log('[Next.js] API 프록시 대상:', apiServerUrl);

    return [
      // trailing slash 있는 경우
      {
        source: '/api/:path*/',
        destination: `${apiServerUrl}/api/:path*/`,
      },
      // trailing slash 없는 경우 -> trailing slash 추가
      {
        source: '/api/:path*',
        destination: `${apiServerUrl}/api/:path*/`,
      },
    ];
  },
};

export default nextConfig;
