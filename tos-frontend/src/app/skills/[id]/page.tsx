'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { skillsApi, attributesApi } from '@/lib/api';
import { Skill, Attribute } from '@/types/api';
import GameImage from '@/components/common/GameImage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { ArrowLeft, Zap, Clock, Target, Star, Book, Box } from 'lucide-react';

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('ko-KR');
  } catch (e) {
    return 'Error';
  }
};

const formatCooldown = (cooldown?: number) => {
  if (!cooldown) return 'N/A';
  // 100초 이상이면 ms로 간주 (TOS 데이터 특성상 쿨다운이 100초 넘는 경우는 드뭄, 보통 10000ms = 10초)
  if (cooldown > 100) {
    return `${cooldown / 1000}초`;
  }
  return `${cooldown}초`;
};

export default function SkillDetailPage() {
  const params = useParams();
  const router = useRouter();
  const skillId = params.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ['skill', skillId],
    queryFn: () => skillsApi.getById(parseInt(skillId)),
    enabled: !!skillId,
  });

  const skill = data?.data as Skill;

  // 관련 특성/아츠 검색 (스킬 이름을 포함하는 특성 검색)
  const { data: attributesData } = useQuery({
    queryKey: ['attributes', 'related', skill?.name],
    queryFn: () => attributesApi.getAll({ search: skill.name, limit: 100 }),
    enabled: !!skill?.name,
  });

  const relatedAttributes = attributesData?.data as Attribute[] || [];

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
          스킬 정보를 불러올 수 없습니다
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

  if (!skill) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">스킬을 찾을 수 없습니다</div>
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
            스킬 목록으로
          </button>
        </div>

        {/* 메인 정보 */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-start space-x-6">
              {/* 스킬 이미지 */}
              <div className="flex-shrink-0">
                <GameImage
                  src={skill.icon_url}
                  alt={skill.name}
                  width={128}
                  height={128}
                  type="skill"
                  className="border-2 border-gray-200"
                />
              </div>

              {/* 기본 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{skill.name}</h1>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                    <Zap className="w-4 h-4 mr-1" />
                    스킬
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Book className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-600">타입:</span>
                    <span className="font-semibold text-gray-900">{skill.type || 'N/A'}</span>
                  </div>

                  {/* 레벨 & 최대 레벨 */}
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-gray-600">레벨:</span>
                    <span className="font-semibold text-gray-900">
                      {skill.level || 0} / {skill.max_level || skill.max_lv || 5}
                    </span>
                  </div>

                  {skill.cooldown && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span className="text-sm text-gray-600">쿨다운:</span>
                      <span className="font-semibold text-gray-900">{formatCooldown(skill.cooldown)}</span>
                    </div>
                  )}

                  {skill.range && (
                    <div className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-red-500" />
                      <span className="text-sm text-gray-600">사거리:</span>
                      <span className="font-semibold text-gray-900">{skill.range}</span>
                    </div>
                  )}

                  {skill.cost && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">비용:</span>
                      <span className="font-semibold text-gray-900">{skill.cost}</span>
                    </div>
                  )}

                  {skill.element && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">속성:</span>
                      <span className="font-semibold text-gray-900">{skill.element}</span>
                    </div>
                  )}
                </div>

                {/* 설명 */}
                {(skill.description || skill.descriptions) && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">설명</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {skill.descriptions || skill.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 관련 특성 및 아츠 */}
        {relatedAttributes.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Box className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-medium text-gray-900">관련 특성 및 아츠</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedAttributes.map((attr) => (
                <div key={attr.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <GameImage
                      src={attr.icon_url}
                      alt={attr.name}
                      width={48}
                      height={48}
                      type="attribute"
                      className="rounded"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{attr.name}</h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {attr.descriptions || attr.description}
                      </p>
                      <div className="mt-2 text-xs text-indigo-600 font-medium">
                        Max Lv. {attr.max_lv}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 스킬 효과 */}
        {skill.effects && typeof skill.effects === 'object' && Object.keys(skill.effects).length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">스킬 효과</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(skill.effects).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <span className="text-sm font-medium text-gray-700">{key}</span>
                  <span className="text-sm font-semibold text-yellow-700">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 필요 조건 */}
        {skill.requirements && typeof skill.requirements === 'object' && Object.keys(skill.requirements).length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">필요 조건</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(skill.requirements).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{key}</span>
                  <span className="text-sm font-semibold text-gray-900">{String(value)}</span>
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
              <span className="ml-2 font-mono text-gray-900 font-semibold">{skill.id}</span>
            </div>
            <div>
              <span className="text-gray-600">IDS:</span>
              <span className="ml-2 font-mono text-gray-900 font-semibold">{skill.ids}</span>
            </div>
            <div>
              <span className="text-gray-600">생성일:</span>
              <span className="ml-2 text-gray-800">
                {formatDate(skill.created || skill.created_at)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">수정일:</span>
              <span className="ml-2 text-gray-800">
                {formatDate(skill.updated || skill.updated_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
