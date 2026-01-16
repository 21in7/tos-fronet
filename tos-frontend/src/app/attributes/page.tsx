'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { attributesApi } from '@/lib/api';
import { Attribute } from '@/types/api';
import GameImage from '@/components/common/GameImage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Pagination from '@/components/common/Pagination';
import { Search, X, ExternalLink, TrendingUp, Target } from 'lucide-react';

export default function AttributesPage() {
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
    queryKey: ['attributes', currentPage, limit, debouncedSearchQuery],
    queryFn: () => attributesApi.getAll({
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
          속성 데이터를 불러올 수 없습니다
        </div>
        <div className="text-gray-600 mb-4">
          {error.message || 'API 서버가 실행 중인지 확인해주세요.'}
        </div>
        <div className="text-sm text-gray-500">
          데이터베이스 테이블이 생성되지 않았을 수 있습니다.
        </div>
      </div>
    );
  }

  // 의미있는 특성만 필터링 (필요시)
  const allAttributes = data?.data as Attribute[];
  const attributes = allAttributes?.filter(attribute => {
    // 기본 정보가 있어야 함
    const hasName = attribute.name && attribute.name.trim() !== '';
    // 필터링 조건: 이름이 있어야 함
    return hasName;
  });

  const pagination = data?.pagination;

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">특성</h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            {debouncedSearchQuery ? (
              <>
                &quot;{debouncedSearchQuery}&quot;에 대한 검색 결과입니다.
                {allAttributes && attributes && (
                  <span className="ml-2 text-xs text-gray-400">
                    ({attributes.length}개 발견)
                  </span>
                )}
              </>
            ) : (
              <>
                캐릭터 특성 목록입니다.
                {allAttributes && attributes && (
                  <span className="ml-2 text-xs text-gray-400">
                    (전체 {allAttributes.length}개 중 {attributes.length}개 표시)
                  </span>
                )}
              </>
            )}
          </p>

          {/* 검색바 */}
          <div className="mt-6">
            <div className="relative w-full sm:max-w-md">
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
                placeholder="특성 이름으로 검색..."
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
          {attributes && attributes.length > 0 ? attributes.map((attribute) => {
            // 타입별 색상 및 아이콘 설정
            const getTypeColor = (type: string) => {
              switch (type) {
                case 'strength':
                  return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', icon: '💪' };
                case 'agility':
                  return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: '⚡' };
                case 'intelligence':
                  return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', icon: '🧠' };
                case 'vitality':
                  return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200', icon: '❤️' };
                case 'luck':
                  return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', icon: '🍀' };
                default:
                  return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200', icon: '📊' };
              }
            };

            const typeStyle = getTypeColor(attribute.type || 'default');

            return (
              <div key={attribute.id} className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  {/* 특성 아이콘 */}
                  <div className="flex-shrink-0">
                    {/* 특성 아이콘 */}
                    <div className="flex-shrink-0">
                      <GameImage
                        src={attribute.icon || attribute.icon_url}
                        alt={attribute.name}
                        width={48}
                        height={48}
                        className="rounded-lg bg-gray-100" // Add bg-gray-100 to match previous style roughly if image fails initially
                        type="attribute"
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <Link href={`/attributes/${attribute.ids || attribute.id}`}>
                        <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600 cursor-pointer">
                          {attribute.name}
                        </h3>
                      </Link>
                      <Link href={`/attributes/${attribute.ids || attribute.id}`} className="text-gray-400 hover:text-indigo-600">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>

                    {attribute.type && (
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeStyle.bg} ${typeStyle.text} border ${typeStyle.border}`}>
                          {attribute.type}
                        </span>
                      </div>
                    )}

                    <p className="text-sm text-gray-500 mt-2">
                      {attribute.descriptions || attribute.description || '설명이 없습니다.'}
                    </p>

                    <div className="mt-3 space-y-2">
                      {attribute.max_lv && (
                        <div className="flex items-center text-sm text-gray-600">
                          <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                          <span>최대 레벨: {attribute.max_lv}</span>
                        </div>
                      )}
                      {attribute.is_toggleable !== undefined && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Target className="w-4 h-4 text-blue-500 mr-2" />
                          <span>토글 가능: {attribute.is_toggleable ? 'Yes' : 'No'}</span>
                        </div>
                      )}
                      {(attribute.base_value && attribute.max_value) && (
                        <div className="text-sm text-gray-600">
                          증가량: +{attribute.max_value - attribute.base_value}
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
                  allAttributes && allAttributes.length > 0
                    ? `"${debouncedSearchQuery}"에 대한 검색 결과가 없습니다`
                    : `"${debouncedSearchQuery}"에 대한 검색 결과가 없습니다`
                ) : (
                  allAttributes && allAttributes.length > 0
                    ? '조건에 맞는 특성이 없습니다'
                    : '특성이 없습니다'
                )}
              </div>
              <div className="text-gray-400 text-sm mt-2">
                {debouncedSearchQuery ? (
                  '다른 검색어로 시도해보세요.'
                ) : (
                  allAttributes && allAttributes.length > 0
                    ? '모든 특성이 필터링되어 표시할 특성이 없습니다.'
                    : '데이터베이스에 특성 데이터를 추가해주세요.'
                )}
              </div>
              {(debouncedSearchQuery || inputValue) && (
                <button
                  onClick={handleClearSearch}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Search className="w-4 h-4 mr-2" />
                  전체 특성 보기
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
