'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { itemsApi } from '@/lib/api';
import { Item } from '@/types/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Pagination from '@/components/common/Pagination';
import { ExternalLink, Search, X } from 'lucide-react';
import GameImage from '@/components/common/GameImage';



export default function ItemsPage() {
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
  }, [inputValue, debouncedSearchQuery]); // debouncedSearchQuery 의존성 추가

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
    queryKey: ['items', currentPage, limit, debouncedSearchQuery],
    queryFn: () => itemsApi.getAll({
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
          아이템 데이터를 불러올 수 없습니다
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

  // 의미있는 아이템만 필터링 (필요시)
  const allItems = data?.data as Item[];
  const items = allItems?.filter(item => {
    // 기본 정보가 있어야 함
    const hasName = item.name && item.name.trim() !== '';
    // 필터링 조건: 이름이 있어야 함
    return hasName;
  });

  const pagination = data?.pagination;

  // 디버깅: 실제 데이터 확인
  console.log('Items data:', items);
  console.log('First item:', items?.[0]);

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">아이템</h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            {debouncedSearchQuery ? (
              <>
                &quot;{debouncedSearchQuery}&quot;에 대한 검색 결과입니다.
                {allItems && items && (
                  <span className="ml-2 text-xs text-gray-400">
                    ({items.length}개 발견)
                  </span>
                )}
              </>
            ) : (
              <>
                게임 내 모든 아이템 목록입니다.
                {allItems && items && (
                  <span className="ml-2 text-xs text-gray-400">
                    (전체 {allItems.length}개 중 {items.length}개 표시)
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
                placeholder="아이템 이름으로 검색..."
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
          {items && items.length > 0 ? items.map((item, index) => {
            // 등급별 색상 설정
            const getGradeColor = (grade: number) => {
              if (grade >= 6) return 'bg-purple-100 text-purple-800';
              if (grade >= 4) return 'bg-blue-100 text-blue-800';
              if (grade >= 2) return 'bg-green-100 text-green-800';
              return 'bg-gray-100 text-gray-800';
            };

            return (
              <div key={item.id} className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <GameImage
                    src={item.icon || item.icon_url}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16"
                    type="item"
                    priority={index < 6} // 첫 6개 이미지는 우선 로딩
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <Link href={`/items/${item.ids || item.id}`}>
                        <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600 cursor-pointer">
                          {item.name}
                        </h3>
                      </Link>
                      <Link href={`/items/${item.ids || item.id}`} className="text-gray-400 hover:text-indigo-600">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>

                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {item.descriptions || item.description || '설명이 없습니다.'}
                    </p>

                    <div className="mt-3 space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(item.grade)}`}>
                          Grade {item.grade}
                        </span>
                        <span className="text-xs text-gray-400">
                          {item.type}
                        </span>
                        {item.equipment && (
                          <span className="text-xs text-indigo-600">
                            {item.equipment.type_equipment}
                          </span>
                        )}
                      </div>

                      {item.equipment && (
                        <div className="flex items-center text-sm text-gray-600">
                          <span>Lv.{item.equipment.level}</span>
                          <span className="mx-2">•</span>
                          <span>★{item.equipment.stars}</span>
                          {(item.equipment.patk > 0 || item.equipment.matk > 0) && (
                            <>
                              <span className="mx-2">•</span>
                              <span className="text-red-600">
                                공격력 {item.equipment.patk > 0 ? item.equipment.patk : item.equipment.matk}
                              </span>
                            </>
                          )}
                        </div>
                      )}

                      <div className="text-sm text-gray-600">
                        무게: {item.weight} / 재사용: {item.cooldown > 0 ? `${item.cooldown}초` : '없음'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg">
                {debouncedSearchQuery ? (
                  allItems && allItems.length > 0
                    ? `&quot;{debouncedSearchQuery}&quot;에 대한 검색 결과가 없습니다`
                    : `&quot;{debouncedSearchQuery}&quot;에 대한 검색 결과가 없습니다`
                ) : (
                  allItems && allItems.length > 0
                    ? '조건에 맞는 아이템이 없습니다'
                    : '아이템이 없습니다'
                )}
              </div>
              <div className="text-gray-400 text-sm mt-2">
                {debouncedSearchQuery ? (
                  '다른 검색어로 시도해보세요.'
                ) : (
                  allItems && allItems.length > 0
                    ? '모든 아이템이 필터링되어 표시할 아이템이 없습니다.'
                    : '데이터베이스에 아이템 데이터를 추가해주세요.'
                )}
              </div>
              {(debouncedSearchQuery || inputValue) && (
                <button
                  onClick={handleClearSearch}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Search className="w-4 h-4 mr-2" />
                  전체 아이템 보기
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
