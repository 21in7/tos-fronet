'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sword, Users, Sparkles, Map, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useLanguageStore, VERSION_LANGUAGE_MAP } from '@/store/useLanguageStore';
import { dashboardApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

const quickLinks = [
  { href: '/jobs', icon: Users, labelKo: '직업', labelEn: 'Jobs', color: 'from-blue-500 to-blue-600' },
  { href: '/skills', icon: Sparkles, labelKo: '스킬', labelEn: 'Skills', color: 'from-purple-500 to-purple-600' },
  { href: '/items', icon: Sword, labelKo: '아이템', labelEn: 'Items', color: 'from-green-500 to-green-600' },
  { href: '/maps', icon: Map, labelKo: '맵', labelEn: 'Maps', color: 'from-orange-500 to-orange-600' },
  { href: '/attributes', icon: BookOpen, labelKo: '특성', labelEn: 'Attributes', color: 'from-red-500 to-red-600' },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { gameVersion } = useLanguageStore();
  const language = VERSION_LANGUAGE_MAP[gameVersion];

  const { data: versionsData, isLoading: isLoadingVersions } = useQuery({
    queryKey: ['dashboard', 'versions'],
    queryFn: () => dashboardApi.getVersions(),
  });

  const versions = versionsData?.data?.dashboard_version || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 검색어가 있으면 아이템 페이지로 이동 (기본 검색)
      router.push(`/items?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Gihyeon of Soul
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {language === 'ko'
            ? '트리 오브 세이비어 데이터베이스에서 원하는 정보를 검색하세요'
            : 'Search the Tree of Savior database for the information you need'}
        </p>
      </div>

      {/* Search Box */}
      <form onSubmit={handleSearch} className="w-full max-w-2xl mb-12">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ko' ? '아이템, 스킬, 몬스터 등 검색...' : 'Search items, skills, monsters...'}
            className="block w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl 
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                       shadow-lg hover:shadow-xl transition-shadow
                       bg-white placeholder-gray-400"
          />
          <button
            type="submit"
            className="absolute inset-y-2 right-2 px-6 bg-gradient-to-r from-blue-500 to-blue-600 
                       text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 
                       transition-all shadow-md hover:shadow-lg"
          >
            {language === 'ko' ? '검색' : 'Search'}
          </button>
        </div>
      </form>

      {/* Quick Links */}
      <div className="w-full max-w-3xl mb-12">
        <h2 className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
          {language === 'ko' ? '빠른 탐색' : 'Quick Navigation'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center p-4 rounded-xl 
                           bg-gradient-to-br ${link.color} text-white
                           hover:scale-105 hover:shadow-lg transition-all duration-200
                           shadow-md`}
              >
                <Icon className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">
                  {language === 'ko' ? link.labelKo : link.labelEn}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Game Versions */}
      <div className="w-full max-w-4xl">
        <h2 className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
          {language === 'ko' ? '게임 버전' : 'Game Versions'}
        </h2>

        {isLoadingVersions ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        ) : versions && versions.length > 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative w-full max-w-xs">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base text-gray-900 font-medium border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white"
                defaultValue={versions[0]}
                onChange={(e) => router.push(`/items?version=${e.target.value}`)}
              >
                {versions.map((version, index) => {
                  // version 객체에서 version 속성 추출
                  const versionValue = typeof version === 'object' && version !== null
                    ? (version as { version?: string }).version || ''
                    : String(version);
                  return (
                    <option key={`${versionValue}-${index}`} value={versionValue}>
                      {versionValue.replace('.ipf', '')}
                    </option>
                  );
                })}
              </select>
            </div>
            <p className="text-xs text-gray-500">
              {language === 'ko' ? '버전을 선택하면 해당 버전의 아이템 정보를 볼 수 있습니다.' : 'Select a version to view item information for that version.'}
            </p>
          </div>
        ) : (
          <div className="text-center text-gray-400 text-sm">
            {language === 'ko' ? '버전 정보를 불러올 수 없습니다.' : 'Failed to load versions.'}
          </div>
        )}
      </div>
    </div>
  );
}