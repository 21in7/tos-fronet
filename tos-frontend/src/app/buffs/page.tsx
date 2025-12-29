'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { buffsApi } from '@/lib/api';
import { Buff } from '@/types/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Pagination from '@/components/common/Pagination';
import { Search, X, ExternalLink, Clock, Zap, Shield } from 'lucide-react';

export default function BuffsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [inputValue, setInputValue] = useState(''); // 입력 필드의 실제 값
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(''); // API 호출용 검색어
  const searchInputRef = useRef<HTMLInputElement>(null); // 입력 필드 참조

  // debounce 효과 - 500ms 후에 검색어 업데이트
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(inputValue);
      if (inputValue !== debouncedSearchQuery) {
        setCurrentPage(1); // 검색어가 변경되면 첫 페이지로 리셋
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue, debouncedSearchQuery]);

  // 검색어 변경 핸들러 - useCallback으로 메모이제이션
  const handleSearchChange = useCallback((query: string) => {
    setInputValue(query);
  }, []);

  // 검색어 클리어 핸들러 - useCallback으로 메모이제이션
  const handleClearSearch = useCallback(() => {
    setInputValue('');
    setDebouncedSearchQuery('');
    setCurrentPage(1);
    // 클리어 후에도 포커스 유지
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ['buffs', currentPage, limit, debouncedSearchQuery],
    queryFn: () => buffsApi.getAll({
      page: currentPage,
      limit,
      search: debouncedSearchQuery || undefined
    }),
  });

  // 포커스 유지를 위한 useEffect - useQuery 이후에 배치
  useEffect(() => {
    // 검색어가 있고, 로딩이 완료되었을 때, 포커스가 검색 필드에 없다면 복원
    if (searchInputRef.current &&
      debouncedSearchQuery &&
      !isLoading &&
      document.activeElement !== searchInputRef.current &&
      document.activeElement?.tagName !== 'INPUT' && // 다른 input에 포커스가 있지 않을 때만
      document.activeElement?.tagName !== 'BUTTON') { // 버튼에 포커스가 있지 않을 때만

      const timer = setTimeout(() => {
        // 검색 입력 필드가 여전히 존재하고 화면에 보이는지 확인
        if (searchInputRef.current && searchInputRef.current.offsetParent !== null) {
          searchInputRef.current.focus();
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [debouncedSearchQuery, isLoading]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-semibold mb-2">
          버프 정보를 불러올 수 없습니다
        </div>
        <div className="text-gray-600">
          잠시 후 다시 시도해주세요.
        </div>
      </div>
    );
  }

  // 의미있는 버프만 필터링 (필요시)
  const allBuffs = data?.data as Buff[];
  const buffs = allBuffs?.filter(buff => {
    // 기본 정보가 있어야 함
    const hasName = buff.name && buff.name.trim() !== '';
    // 필터링 조건: 이름이 있어야 함
    return hasName;
  });

  const pagination = data?.pagination;

  // 효과 타입별 색상 및 아이콘 설정
  const getEffectTypeStyle = (effectType?: string) => {
    switch (effectType) {
      case 'damage':
        return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', icon: <Zap className="w-4 h-4" /> };
      case 'defense':
        return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', icon: <Shield className="w-4 h-4" /> };
      case 'heal':
        return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: '💚' };
      case 'utility':
        return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', icon: '🔮' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200', icon: '✨' };
    }
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">버프</h1>
          <p className="mt-1 text-sm text-gray-500">
            {debouncedSearchQuery ? (
              <>
                &quot;{debouncedSearchQuery}&quot;에 대한 검색 결과입니다.
                {allBuffs && buffs && (
                  <span className="ml-2 text-xs text-gray-400">
                    ({buffs.length}개 발견)
                  </span>
                )}
              </>
            ) : (
              <>
                게임 버프 목록입니다.
                {allBuffs && buffs && (
                  <span className="ml-2 text-xs text-gray-400">
                    (전체 {allBuffs.length}개 중 {buffs.length}개 표시)
                  </span>
                )}
              </>
            )}
          </p>

          {/* 검색바 */}
          <div className="mt-6">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {inputValue !== debouncedSearchQuery ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                ) : (
                  <Search className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="버프 이름으로 검색..."
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {inputValue && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {buffs && buffs.length > 0 ? buffs.map((buff) => {
            const effectStyle = getEffectTypeStyle(buff.effect_type);

            return (
              <div key={buff.id} className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  {/* 버프 아이콘 */}
                  <div className="flex-shrink-0">
                    <div className={`h-12 w-12 rounded-full ${effectStyle.bg} flex items-center justify-center border ${effectStyle.border}`}>
                      {typeof effectStyle.icon === 'string' ? (
                        <span className="text-lg">{effectStyle.icon}</span>
                      ) : (
                        effectStyle.icon
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <Link href={`/buffs/${buff.ids || buff.id}`}>
                        <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600 cursor-pointer">
                          {buff.name}
                        </h3>
                      </Link>
                      <Link href={`/buffs/${buff.ids || buff.id}`} className="text-gray-400 hover:text-indigo-600">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>

                    {buff.effect_type && (
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${effectStyle.bg} ${effectStyle.text} border ${effectStyle.border}`}>
                          {buff.effect_type}
                        </span>
                      </div>
                    )}

                    <p className="text-sm text-gray-500 mt-2">
                      {buff.descriptions || buff.description || '설명이 없습니다.'}
                    </p>

                    <div className="mt-3 space-y-2">
                      {buff.duration && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-blue-500 mr-2" />
                          <span>지속시간: {buff.duration}초</span>
                        </div>
                      )}
                      {buff.cooldown && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Zap className="w-4 h-4 text-orange-500 mr-2" />
                          <span>재사용 대기: {buff.cooldown}초</span>
                        </div>
                      )}
                      {buff.max_lv && (
                        <div className="text-sm text-gray-600">
                          최대 레벨: {buff.max_lv}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg">
                {debouncedSearchQuery ? (
                  allBuffs && allBuffs.length > 0
                    ? `"${debouncedSearchQuery}"에 대한 검색 결과가 없습니다`
                    : `"${debouncedSearchQuery}"에 대한 검색 결과가 없습니다`
                ) : (
                  allBuffs && allBuffs.length > 0
                    ? '조건에 맞는 버프가 없습니다'
                    : '버프가 없습니다'
                )}
              </div>
              <div className="text-gray-400 text-sm mt-2">
                {debouncedSearchQuery ? (
                  '다른 검색어로 시도해보세요.'
                ) : (
                  allBuffs && allBuffs.length > 0
                    ? '모든 버프가 필터링되어 표시할 버프가 없습니다.'
                    : '데이터베이스에 버프 데이터를 추가해주세요.'
                )}
              </div>
              {(debouncedSearchQuery || inputValue) && (
                <button
                  onClick={handleClearSearch}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Search className="w-4 h-4 mr-2" />
                  전체 버프 보기
                </button>
              )}
            </div>
          )}
        </div>

        {pagination && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            hasNext={pagination.hasNext}
            hasPrev={pagination.hasPrev}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
