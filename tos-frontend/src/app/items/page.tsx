'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { itemsApi } from '@/lib/api';
import { Item } from '@/types/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Pagination from '@/components/common/Pagination';
import { ExternalLink } from 'lucide-react';
import GameImage from '@/components/common/GameImage';

const rarityColors = {
  common: 'bg-gray-100 text-gray-800',
  uncommon: 'bg-green-100 text-green-800',
  rare: 'bg-blue-100 text-blue-800',
  epic: 'bg-purple-100 text-purple-800',
  legendary: 'bg-yellow-100 text-yellow-800',
};

export default function ItemsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, error } = useQuery({
    queryKey: ['items', currentPage, limit],
    queryFn: () => itemsApi.getAll({ page: currentPage, limit }),
  });

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

  const items = data?.data as Item[];
  const pagination = data?.pagination;

  // 디버깅: 실제 데이터 확인
  console.log('Items data:', items);
  console.log('First item:', items?.[0]);

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">아이템</h1>
          <p className="mt-1 text-sm text-gray-500">
            게임 내 모든 아이템 목록입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items && items.length > 0 ? items.map((item) => (
            <div key={item.id} className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
              <Link href={`/items/${item.id}`} className="block">
                <div className="flex items-start space-x-4">
                  <GameImage
                    src={item.icon_url}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="flex-shrink-0"
                    type="item"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 truncate hover:text-indigo-600">
                        {item.name}
                      </h3>
                      <ExternalLink className="w-4 h-4 text-gray-400 hover:text-indigo-600" />
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${rarityColors[item.rarity]}`}>
                        {item.rarity}
                      </span>
                      <span className="text-xs text-gray-400">
                        Lv.{item.level}
                      </span>
                      <span className="text-xs text-gray-400">
                        {item.type}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      가격: {item.price ? item.price.toLocaleString() : 0}G
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg">아이템이 없습니다</div>
              <div className="text-gray-400 text-sm mt-2">
                데이터베이스에 아이템 데이터를 추가해주세요.
              </div>
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
