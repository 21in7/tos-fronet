import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import Layout from '@/components/layout/Layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tavern of Soul - 게임 데이터 관리',
  description: 'Tavern of Soul 게임 데이터 관리 시스템',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://r2.gihyeonofsoul.com" />
        <link rel="dns-prefetch" href="https://r2.gihyeonofsoul.com" />
      </head>
      <body className={inter.className}>
        <QueryProvider>
          <Layout>
            {children}
          </Layout>
        </QueryProvider>
      </body>
    </html>
  );
}