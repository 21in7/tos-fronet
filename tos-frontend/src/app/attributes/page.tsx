'use client';

import { useQuery } from '@tanstack/react-query';
import { attributesApi } from '@/lib/api';
import { Attribute } from '@/types/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import React from 'react';

export default function AttributesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['attributes'],
    queryFn: () => attributesApi.getAll(),
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

  const attributes = data?.data as Attribute[];

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">특성</h1>
          <p className="mt-1 text-sm text-gray-500">
            캐릭터 특성 목록입니다.
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {attributes && attributes.length > 0 ? attributes.map((attribute) => (
              <li key={attribute.id}>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold">
                          {attribute.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {attribute.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {attribute.description}
                      </div>
                      <div className="text-xs text-gray-400">
                        타입: {attribute.type} | 기본값: {attribute.base_value} | 최대값: {attribute.max_value}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </li>
            )) : (
              <li>
                <div className="px-4 py-8 text-center">
                  <div className="text-gray-500 text-lg">특성이 없습니다</div>
                  <div className="text-gray-400 text-sm mt-2">
                    데이터베이스에 특성 데이터를 추가해주세요.
                  </div>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </ErrorBoundary>
  );
}
