'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { skillsApi } from '@/lib/api';
import { Skill } from '@/types/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Pagination from '@/components/common/Pagination';
import { Zap, Clock, Droplets, ExternalLink } from 'lucide-react';
import GameImage from '@/components/common/GameImage';

// 스킬 계수 배열 파싱 헬퍼
const parseJsonArray = (jsonStr: string | null | undefined): number[] => {
  if (!jsonStr) return [];
  try {
    return JSON.parse(jsonStr);
  } catch {
    return [];
  }
};

// 마스터 레벨에 해당하는 스킬 계수 가져오기
const getSkillFactorAtMaxLevel = (skill: Skill): number | null => {
  const maxLevel = skill.max_lv || skill.max_level || skill.level || 5;
  const arr = parseJsonArray(skill.sfr);
  if (arr.length === 0) return null;
  const index = Math.max(0, Math.min(maxLevel - 1, arr.length - 1));
  return arr[index];
};

export default function SkillsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, error } = useQuery({
    queryKey: ['skills', currentPage, limit],
    queryFn: () => skillsApi.getAll({ page: currentPage, limit }),
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
          스킬 데이터를 불러올 수 없습니다
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

  const skills = data?.data as Skill[];
  const pagination = data?.pagination;

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">스킬</h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            게임 내 모든 스킬 목록입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills && skills.length > 0 ? skills.map((skill) => (
            <div key={skill.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <GameImage
                  src={skill.icon || skill.icon_url}
                  alt={skill.name}
                  width={48}
                  height={48}
                  className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16"
                  type="skill"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Link href={`/skills/${skill.id}`}>
                        <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600 cursor-pointer">
                          {skill.name}
                        </h3>
                      </Link>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${skill.type === 'active'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                        }`}>
                        {skill.type === 'active' ? '액티브' : '패시브'}
                      </span>
                    </div>
                    <Link href={`/skills/${skill.id}`} className="text-gray-400 hover:text-indigo-600">
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {skill.description}
                  </p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">레벨:</span>
                      <span className="ml-2">{skill.max_lv || skill.max_level || skill.level || '-'}</span>
                    </div>
                    {skill.type === 'active' && (
                      <>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-gray-400 mr-2" />
                          <span>쿨다운: {skill.cooldown ? `${(skill.cooldown / 1000).toFixed(1)}초` : '-'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Droplets className="w-4 h-4 text-blue-400 mr-2" />
                          <span>SP: {skill.sp || '-'}</span>
                        </div>
                      </>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <Zap className="w-4 h-4 text-yellow-500 mr-2" />
                      <span>데미지: {(() => {
                        const skillFactor = getSkillFactorAtMaxLevel(skill);
                        if (skillFactor !== null) {
                          return `${skillFactor.toLocaleString()}%`;
                        }
                        return skill.damage || '-';
                      })()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg">스킬이 없습니다</div>
              <div className="text-gray-400 text-sm mt-2">
                데이터베이스에 스킬 데이터를 추가해주세요.
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
