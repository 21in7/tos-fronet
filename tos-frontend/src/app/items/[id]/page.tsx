'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { itemsApi } from '@/lib/api';
import { Item } from '@/types/api';
import GameImage from '@/components/common/GameImage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { ArrowLeft, Sword, Star, Weight, Coins } from 'lucide-react';

const rarityColors = {
  common: 'bg-gray-100 text-gray-800 border-gray-200',
  uncommon: 'bg-green-100 text-green-800 border-green-200',
  rare: 'bg-blue-100 text-blue-800 border-blue-200',
  epic: 'bg-purple-100 text-purple-800 border-purple-200',
  legendary: 'bg-yellow-100 text-yellow-800 border-yellow-200',
};

const typeColors = {
  weapon: 'bg-red-100 text-red-800',
  armor: 'bg-blue-100 text-blue-800',
  accessory: 'bg-purple-100 text-purple-800',
  consumable: 'bg-green-100 text-green-800',
  material: 'bg-gray-100 text-gray-800',
};

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ['item', itemId],
    queryFn: () => itemsApi.getById(parseInt(itemId)),
    enabled: !!itemId,
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
          아이템 정보를 불러올 수 없습니다
        </div>
        <div className="text-gray-600 mb-4">
          {error.message || '다시 시도해주세요.'}
        </div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          돌아가기
        </button>
      </div>
    );
  }

  const item = data?.data as Item;

  if (!item) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">아이템을 찾을 수 없습니다</div>
        <button
          onClick={() => router.back()}
          className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            아이템 목록으로
          </button>
        </div>

        {/* 메인 정보 */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-start space-x-6">
              {/* 아이템 이미지 */}
              <div className="flex-shrink-0">
                <GameImage
                  src={item.icon_url}
                  alt={item.name}
                  width={128}
                  height={128}
                  type="item"
                  className="border-2 border-gray-200"
                />
              </div>

              {/* 기본 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{item.name}</h1>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${rarityColors[item.rarity as keyof typeof rarityColors] || rarityColors.common}`}>
                    <Star className="w-4 h-4 mr-1" />
                    {item.rarity}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Sword className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">타입:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${typeColors[item.type as keyof typeof typeColors] || typeColors.material}`}>
                      {item.type}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">레벨:</span>
                    <span className="font-semibold text-gray-900">{item.level}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Weight className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">무게:</span>
                    <span className="font-semibold text-gray-900">{item.weight || 0}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Coins className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-gray-600">가격:</span>
                    <span className="font-semibold text-gray-900">
                      {item.price ? item.price.toLocaleString() : 0}G
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">스택 가능:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      item.stackable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.stackable ? '예' : '아니오'}
                    </span>
                  </div>
                </div>

                {/* 설명 */}
                {(item.descriptions || item.description) && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">설명</h3>
                    <p className="text-gray-700 leading-relaxed">{item.descriptions || item.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 스탯 정보 */}
        {item.stats && Object.keys(item.stats).length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">스탯</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(item.stats).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{key}</span>
                  <span className="text-sm font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 메타 정보 */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">상세 정보</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">ID:</span>
              <span className="ml-2 font-mono">{item.id}</span>
            </div>
            <div>
              <span className="text-gray-600">생성일:</span>
              <span className="ml-2">{new Date(item.created_at).toLocaleDateString('ko-KR')}</span>
            </div>
            <div>
              <span className="text-gray-600">수정일:</span>
              <span className="ml-2">{new Date(item.updated_at).toLocaleDateString('ko-KR')}</span>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
