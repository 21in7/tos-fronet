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
  Calculator,
  Globe
} from 'lucide-react';
import ApiStatus from '@/components/common/ApiStatus';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguageStore, VERSION_INFO, GameVersion } from '@/store/useLanguageStore';

export default function Header() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { gameVersion, setGameVersion } = useLanguageStore();

  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isVersionOpen, setIsVersionOpen] = useState(false);

  const navigation = [
    { name: t.nav.dashboard, href: '/', icon: Home },
    { name: t.nav.attributes, href: '/attributes', icon: BarChart3 },
    { name: t.nav.buffs, href: '/buffs', icon: Shield },
    { name: t.nav.items, href: '/items', icon: Sword },
    { name: t.nav.monsters, href: '/monsters', icon: Skull },
    { name: t.nav.skills, href: '/skills', icon: Zap },
    { name: t.nav.jobs, href: '/jobs', icon: Briefcase },
    { name: t.nav.maps, href: '/maps', icon: Map },
    { name: t.nav.challenges, href: '/challenges', icon: Sword },
    { name: t.nav.planner, href: '/planner', icon: Briefcase },
  ];

  const simulatorItems = [
    { name: t.nav.archeology, href: '/simulator/archeology', icon: Pickaxe },
    { name: t.nav.reinforce, href: '/simulator/reinforce', icon: Hammer },
    { name: t.nav.gearscore, href: '/simulator/gearscore', icon: Calculator },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSimulatorOpen(false);
    setIsVersionOpen(false);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.simulator-dropdown')) {
        setIsSimulatorOpen(false);
      }
      if (!target.closest('.version-dropdown')) {
        setIsVersionOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isSimulatorActive = pathname.startsWith('/simulator');

  const handleVersionChange = (version: GameVersion) => {
    setGameVersion(version);
    setIsVersionOpen(false);
  };

  if (!mounted) {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                  <span className="hidden sm:inline">Tree of Savior</span>
                  <span className="sm:hidden">ToS</span>
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
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                <span className="hidden sm:inline">{t.header.title}</span>
                <span className="sm:hidden">{t.header.titleShort}</span>
              </h1>
            </div>
            <nav className="hidden lg:ml-6 lg:flex lg:space-x-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
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
                  {t.nav.simulator}
                  <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isSimulatorOpen ? 'rotate-180' : ''}`} />
                </button>

                {isSimulatorOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50">
                    {simulatorItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
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

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Version Selector Dropdown */}
            <div className="relative version-dropdown">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVersionOpen(!isVersionOpen);
                }}
                className="inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                <Globe className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{VERSION_INFO[gameVersion].flag}</span>
                <span className="font-semibold">{VERSION_INFO[gameVersion].name}</span>
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isVersionOpen ? 'rotate-180' : ''}`} />
              </button>

              {isVersionOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50">
                  {(Object.keys(VERSION_INFO) as GameVersion[]).map((version) => (
                    <button
                      key={version}
                      onClick={() => handleVersionChange(version)}
                      className={`flex items-center w-full px-4 py-2 text-sm font-medium ${gameVersion === version
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-900 hover:bg-gray-100'
                        }`}
                    >
                      <span className="mr-2 text-lg">{VERSION_INFO[version].flag}</span>
                      <span>{VERSION_INFO[version].name}</span>
                      {gameVersion === version && (
                        <span className="ml-auto text-indigo-600">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden md:block">
              <ApiStatus />
            </div>
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-3 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 min-w-[44px] min-h-[44px]"
              >
                <span className="sr-only">{t.nav.openMenu}</span>
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
                  key={item.href}
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
                {t.nav.simulator}
              </div>
              {simulatorItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
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
