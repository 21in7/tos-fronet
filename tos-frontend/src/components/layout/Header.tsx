'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Sword,
  Shield,
  Skull,
  Zap,
  Briefcase,
  Map,
  BarChart3
} from 'lucide-react';
import ApiStatus from '@/components/common/ApiStatus';

const navigation = [
  { name: '대시보드', href: '/', icon: Home },
  { name: '특성', href: '/attributes', icon: BarChart3 },
  { name: '버프', href: '/buffs', icon: Shield },
  { name: '아이템', href: '/items', icon: Sword },
  { name: '몬스터', href: '/monsters', icon: Skull },
  { name: '스킬', href: '/skills', icon: Zap },
  { name: '직업', href: '/jobs', icon: Briefcase },
  { name: '맵', href: '/maps', icon: Map },
  { name: '챌린지', href: '/challenges', icon: Sword },
  { name: '플래너', href: '/planner', icon: Briefcase },
];

export default function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  트리오브세이비어
                </h1>
              </div>
              <div className="ml-4 flex items-center">
                <ApiStatus />
              </div>
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 text-sm font-medium"
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                트리오브세이비어
              </h1>
            </div>
            <div className="ml-4 flex items-center">
              <ApiStatus />
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium whitespace-nowrap ${isActive
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900'
                      }`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
