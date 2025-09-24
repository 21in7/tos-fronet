'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { itemsApi } from '@/lib/api';
import { Item } from '@/types/api';
import GameImage from '@/components/common/GameImage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { ArrowLeft, Sword, Star, Weight, Coins, Shield, Info } from 'lucide-react';

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const itemIds = params.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ['item', itemIds],
    queryFn: () => itemsApi.getById(itemIds),
    enabled: !!itemIds,
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

  // 텍스트 파싱 함수 ({nl}, {#color}, {img} 태그 처리)
  const parseText = (text: string) => {
    if (!text) return '';
    return text
      .replace(/\{nl\}/g, '\n')
      .replace(/\{#([0-9a-fA-F]{6})\}/g, '<span style="color: #$1">')
      .replace(/\{\/\}/g, '</span>')
      .replace(/\{img\s+[^}]*\}/g, '') // 이미지 태그 제거
      .trim();
  };

  // 거래 가능 여부 해석
  const getTradabilityText = (tradability: string) => {
    if (tradability === 'TFFT') return '거래 가능 (일부 제한)';
    if (tradability === 'TTTT') return '완전 거래 가능';
    if (tradability === 'FFFF') return '거래 불가능';
    return tradability;
  };

  // 등급별 색상 설정
  const getGradeColor = (grade: number) => {
    if (grade >= 6) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (grade >= 4) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (grade >= 2) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <ErrorBoundary>
      <div className="max-w-6xl mx-auto space-y-8 p-6">
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

        {/* 메인 제목과 설명 */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <h1 className="text-4xl font-bold text-gray-900">{item.name}</h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getGradeColor(item.grade)}`}>
                Grade {item.grade}
              </span>
              {item.equipment && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                  {item.equipment.type_equipment}
                </span>
              )}
            </div>
            
            {/* 설명 */}
            {item.descriptions && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-gray-700 leading-relaxed">
                  {parseText(item.descriptions).split('\n').map((line, index) => (
                    <div key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: line }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 아이템 기본 정보 테이블 */}
          <div className="mb-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ClassID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ClassName
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Weight
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tradability
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cooldown
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {item.ids}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.id_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Weight className="w-4 h-4 text-gray-500 mr-2" />
                        {item.weight}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getTradabilityText(item.tradability)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.cooldown > 0 ? `${item.cooldown}초` : 'N/A'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 장비 정보 */}
          {item.equipment && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Info className="w-5 h-5 text-blue-500 mr-2" />
                장비 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Sword className="w-5 h-5 text-red-600 mr-2" />
                    <h4 className="font-medium text-gray-900">공격력</h4>
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    {item.equipment.patk > 0 ? item.equipment.patk : item.equipment.matk}
                  </p>
                  <p className="text-sm text-gray-600">
                    {item.equipment.patk > 0 ? '물리 공격력' : '마법 공격력'}
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Shield className="w-5 h-5 text-blue-600 mr-2" />
                    <h4 className="font-medium text-gray-900">방어력</h4>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {item.equipment.pdef > 0 ? item.equipment.pdef : item.equipment.mdef}
                  </p>
                  <p className="text-sm text-gray-600">
                    {item.equipment.pdef > 0 ? '물리 방어력' : '마법 방어력'}
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Star className="w-5 h-5 text-yellow-600 mr-2" />
                    <h4 className="font-medium text-gray-900">강화 정보</h4>
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">Lv.{item.equipment.level}</p>
                  <p className="text-sm text-gray-600">
                    ★{item.equipment.stars} / 내구도 {item.equipment.durability}
                  </p>
                </div>
              </div>

              {/* 장비 상세 정보 */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">소켓 제한:</span>
                  <span className="ml-2 font-semibold">{item.equipment.sockets_limit}</span>
                </div>
                <div>
                  <span className="text-gray-600">포텐셜:</span>
                  <span className="ml-2 font-semibold">{item.equipment.potential >= 0 ? `+${item.equipment.potential}` : 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-600">필요 클래스:</span>
                  <span className="ml-2 font-mono text-xs">{item.equipment.requiredClass}</span>
                </div>
                <div>
                  <span className="text-gray-600">미확인:</span>
                  <span className="ml-2 font-semibold">{item.equipment.unidentified ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Visual 섹션 */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Visual</h2>
          <div className="flex justify-center">
            <div className="relative">
              <GameImage
                src={item.icon_url}
                alt={item.name}
                width={200}
                height={200}
                className="rounded-lg shadow-lg"
                type="item"
                priority={true}
              />
              {/* 등급 표시 */}
              <div className="absolute top-2 right-2">
                <div className={`px-2 py-1 rounded-full text-xs font-bold ${getGradeColor(item.grade)}`}>
                  G{item.grade}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 메타 정보 */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">상세 정보</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">ID:</span>
              <span className="ml-2 font-mono text-gray-900 font-semibold">{item.id}</span>
            </div>
            <div>
              <span className="text-gray-600">IDS:</span>
              <span className="ml-2 font-mono text-gray-900 font-semibold">{item.ids}</span>
            </div>
            <div>
              <span className="text-gray-600">생성일:</span>
              <span className="ml-2 text-gray-800">{new Date(item.created || item.created_at || '').toLocaleDateString('ko-KR')}</span>
            </div>
            <div>
              <span className="text-gray-600">수정일:</span>
              <span className="ml-2 text-gray-800">{new Date(item.updated || item.updated_at || '').toLocaleDateString('ko-KR')}</span>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}