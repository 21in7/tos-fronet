'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { monstersApi } from '@/lib/api';
import { Monster } from '@/types/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Pagination from '@/components/common/Pagination';
import { Heart, Shield, Zap, ExternalLink } from 'lucide-react';
import GameImage from '@/components/common/GameImage';

export default function MonstersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, error } = useQuery({
    queryKey: ['monsters', currentPage, limit],
    queryFn: () => monstersApi.getAll({ page: currentPage, limit }),
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
          몬스터 데이터를 불러올 수 없습니다
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

  const monsters = data?.data as Monster[];
  const pagination = data?.pagination;

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">몬스터</h1>
          <p className="mt-1 text-sm text-gray-500">
            게임 내 모든 몬스터 목록입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {monsters && monsters.length > 0 ? monsters.map((monster) => (
            <div key={monster.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <GameImage
                  src={monster.icon_url}
                  alt={monster.name}
                  width={64}
                  height={64}
                  className="flex-shrink-0"
                  type="monster"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <Link href={`/monsters/${monster.id}`}>
                      <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600 cursor-pointer">
                        {monster.name}
                      </h3>
                    </Link>
                    <Link href={`/monsters/${monster.id}`} className="text-gray-400 hover:text-indigo-600">
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {monster.description}
                  </p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">레벨:</span>
                      <span className="ml-2">{monster.level}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Heart className="w-4 h-4 text-red-500 mr-2" />
                      <span>HP: {monster.hp}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Shield className="w-4 h-4 text-blue-500 mr-2" />
                      <span>방어력: {monster.defense}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Zap className="w-4 h-4 text-yellow-500 mr-2" />
                      <span>공격력: {monster.attack}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      경험치: {monster.experience} EXP
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg">몬스터가 없습니다</div>
              <div className="text-gray-400 text-sm mt-2">
                데이터베이스에 몬스터 데이터를 추가해주세요.
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
