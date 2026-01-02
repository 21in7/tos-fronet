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
  BarChart3,
  Menu,
  X,
  ChevronDown,
  Pickaxe,
  Hammer,
  Calculator
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

const simulatorItems = [
  { name: '고고학 옵션', href: '/simulator/archeology', icon: Pickaxe },
  { name: '장비 강화', href: '/simulator/reinforce', icon: Hammer },
  { name: '기어스코어', href: '/simulator/gearscore', icon: Calculator },
];

export default function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSimulatorOpen(false);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.simulator-dropdown')) {
        setIsSimulatorOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isSimulatorActive = pathname.startsWith('/simulator');

  if (!mounted) {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  트리오브세이비어
                </h1>
              </div>
            </div>
            <div className="flex items-center">
              <ApiStatus />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                트리오브세이비어
              </h1>
            </div>
            <nav className="hidden lg:ml-6 lg:flex lg:space-x-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-2 pt-1 border-b-2 text-sm font-medium whitespace-nowrap ${isActive
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900'
                      }`}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {/* Simulator Dropdown */}
              <div className="relative simulator-dropdown">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSimulatorOpen(!isSimulatorOpen);
                  }}
                  className={`inline-flex items-center px-2 pt-1 border-b-2 text-sm font-medium whitespace-nowrap ${isSimulatorActive
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900'
                    }`}
                >
                  <Calculator className="w-4 h-4 mr-1" />
                  시뮬레이터
                  <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isSimulatorOpen ? 'rotate-180' : ''}`} />
                </button>

                {isSimulatorOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50">
                    {simulatorItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`flex items-center px-4 py-2 text-sm font-medium ${isActive
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-gray-900 hover:bg-gray-100'
                            }`}
                        >
                          <item.icon className="w-4 h-4 mr-2" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <ApiStatus />
            </div>
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">메뉴 열기</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    }`}
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </div>
                </Link>
              );
            })}

            {/* Mobile Simulator Section */}
            <div className="border-t border-gray-200 pt-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                시뮬레이터
              </div>
              {simulatorItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                      }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
