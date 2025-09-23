'use client';

import { useQuery } from '@tanstack/react-query';
import { mapsApi } from '@/lib/api';
import { Map } from '@/types/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { MapPin, Skull, Gift } from 'lucide-react';
import GameImage from '@/components/common/GameImage';

export default function MapsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['maps'],
    queryFn: () => mapsApi.getAll(),
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
          맵 데이터를 불러올 수 없습니다
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

  const maps = data?.data as Map[];

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">맵</h1>
          <p className="mt-1 text-sm text-gray-500">
            게임 내 모든 맵 목록입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {maps && maps.length > 0 ? maps.map((map) => (
            <div key={map.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <GameImage
                  src={map.icon_url}
                  alt={map.name}
                  width={64}
                  height={64}
                  className="flex-shrink-0"
                  type="map"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-indigo-500" />
                      <h3 className="text-lg font-medium text-gray-900">
                        {map.name}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {map.description}
                  </p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">레벨:</span>
                      <span className="ml-2">{map.level}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Skull className="w-4 h-4 text-red-500 mr-2" />
                      <span>몬스터 수: {map.monsters?.length || 0}마리</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Gift className="w-4 h-4 text-green-500 mr-2" />
                      <span>보상: {Object.keys(map.rewards || {}).length}개</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg">맵이 없습니다</div>
              <div className="text-gray-400 text-sm mt-2">
                데이터베이스에 맵 데이터를 추가해주세요.
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
