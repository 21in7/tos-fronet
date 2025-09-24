'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { attributesApi } from '@/lib/api';
import { Attribute } from '@/types/api';
import GameImage from '@/components/common/GameImage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { ArrowLeft, Info, Settings } from 'lucide-react';

export default function AttributeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const attributeIds = params.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ['attribute', attributeIds],
    queryFn: () => attributesApi.getById(attributeIds),
    enabled: !!attributeIds,
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
          특성 정보를 불러올 수 없습니다
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

  const attribute = data?.data as Attribute;

  if (!attribute) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">특성을 찾을 수 없습니다</div>
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

  // 텍스트 파싱 함수 ({nl}, {b} 태그 처리)
  const parseText = (text: string) => {
    if (!text) return '';
    return text
      .replace(/\{nl\}/g, '\n')
      .replace(/\{b\}(.*?)\{b\}/g, '<strong>$1</strong>')
      .trim();
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
            특성 목록으로
          </button>
        </div>

        {/* 메인 제목과 설명 */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{attribute.name}</h1>
            
            {/* 설명 */}
            {attribute.descriptions && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-gray-700 leading-relaxed">
                  {parseText(attribute.descriptions).split('\n').map((line, index) => (
                    <div key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: line }} />
                  ))}
                </div>
              </div>
            )}

            {/* 요구사항 */}
            {attribute.descriptions_required && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Info className="w-5 h-5 text-blue-500 mr-2" />
                  Requirement
                </h3>
                <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
                  <div className="text-gray-700">
                    {parseText(attribute.descriptions_required).split('\n').map((line, index) => (
                      <div key={index} className="mb-1" dangerouslySetInnerHTML={{ __html: line }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 특성 정보 테이블 */}
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
                      is toggleable
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Max Level
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {attribute.ids}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {attribute.id_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        attribute.is_toggleable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {attribute.is_toggleable ? 'O' : 'X'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {attribute.max_lv}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Visual 섹션 */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Visual</h2>
          <div className="flex justify-center">
            <div className="relative">
              <GameImage
                src={attribute.icon_url}
                alt={attribute.name}
                width={200}
                height={200}
                className="rounded-lg shadow-lg"
                type="item"
                priority={true}
              />
              {/* 토글 가능 여부 표시 */}
              {attribute.is_toggleable === 0 && (
                <div className="absolute bottom-2 right-2">
                  <div className="bg-red-500 rounded-full p-2">
                    <Settings className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 메타 정보 */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">상세 정보</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">ID:</span>
              <span className="ml-2 font-mono">{attribute.id}</span>
            </div>
            <div>
              <span className="text-gray-600">IDS:</span>
              <span className="ml-2 font-mono">{attribute.ids}</span>
            </div>
            <div>
              <span className="text-gray-600">생성일:</span>
              <span className="ml-2">{new Date(attribute.created || attribute.created_at || '').toLocaleDateString('ko-KR')}</span>
            </div>
            <div>
              <span className="text-gray-600">수정일:</span>
              <span className="ml-2">{new Date(attribute.updated || attribute.updated_at || '').toLocaleDateString('ko-KR')}</span>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
