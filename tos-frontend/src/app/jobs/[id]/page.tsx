'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { jobsApi, skillsApi } from '@/lib/api';
import { Job, Skill } from '@/types/api';
import GameImage from '@/components/common/GameImage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { ArrowLeft, Briefcase, Users, Zap } from 'lucide-react';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ['job-detail', jobId],
    queryFn: () => {
      console.log('🔍 직업 상세 API 호출:', { jobId });
      // 백엔드에서 id 필터가 추가되어 올바르게 작동
      return jobsApi.getAll({ id: parseInt(jobId) });
    },
    enabled: !!jobId,
    staleTime: 0, // 항상 최신 데이터 요청
    gcTime: 0, // 캐시 사용하지 않음
  });

  // 직업 관련 스킬 조회
  const { data: skillsData } = useQuery({
    queryKey: ['job-skills', jobId],
    queryFn: () => skillsApi.getAll({ job_id: parseInt(jobId), limit: 100 }),
    enabled: !!jobId && !!(data?.data as Job[])?.[0],
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
          직업 정보를 불러올 수 없습니다
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

  // 백엔드에서 id 필터가 완전히 작동하지 않으므로 클라이언트에서 올바른 직업 찾기
  const jobsArray = data?.data as Job[] || [];
  const job = jobsArray.find(j => j.id.toString() === jobId);
  const skills = skillsData?.data as Skill[] || [];

  // 디버깅: API 응답 데이터 확인
  console.log('🔍 직업 상세 데이터:', {
    jobId,
    data,
    jobsArray,
    foundJob: jobsArray.find(j => j.id.toString() === jobId),
    job,
    skillsCount: skills.length
  });

  if (!job) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">직업을 찾을 수 없습니다</div>
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
            직업 목록으로
          </button>
        </div>

        {/* 메인 정보 */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-start space-x-6">
              {/* 직업 이미지 */}
              <div className="flex-shrink-0">
                <GameImage
                  src={job.icon_url}
                  alt={job.name}
                  width={128}
                  height={128}
                  type="job"
                  className="border-2 border-gray-200"
                />
              </div>

              {/* 기본 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{job.name}</h1>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                    <Briefcase className="w-4 h-4 mr-1" />
                    직업
                  </span>
                </div>

                {/* Job Tree 표시 */}
                {job.job_tree && (
                  <div className="mb-6">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-indigo-500" />
                      <span className="text-sm text-gray-600">직업 계열:</span>
                      <span className="font-semibold text-indigo-600">{job.job_tree}</span>
                    </div>
                  </div>
                )}

                {/* 설명 */}
                {(job.descriptions || job.description) && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">설명</h3>
                    <p className="text-gray-700 leading-relaxed">{job.descriptions || job.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 요구사항 */}
        {job.requirements && typeof job.requirements === 'object' && Object.keys(job.requirements).length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">요구사항</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(job.requirements).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{key}</span>
                  <span className="text-sm font-semibold text-gray-900">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 보너스 */}
        {job.bonuses && typeof job.bonuses === 'object' && Object.keys(job.bonuses).length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">보너스</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(job.bonuses).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-sm font-medium text-gray-700">{key}</span>
                  <span className="text-sm font-semibold text-green-600">+{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 관련 스킬 */}
        {skills.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-medium text-gray-900">관련 스킬</h3>
              <span className="text-sm text-gray-500">({skills.length}개)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  onClick={() => router.push(`/skills/${skill.id}`)}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex-shrink-0">
                    <GameImage
                      src={skill.icon_url}
                      alt={skill.name}
                      width={40}
                      height={40}
                      type="skill"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{skill.name}</div>
                    <div className="text-xs text-gray-500 truncate">{skill.description}</div>
                  </div>
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
              <span className="ml-2 font-mono text-gray-900 font-semibold">{job.id}</span>
            </div>
            <div>
              <span className="text-gray-600">IDS:</span>
              <span className="ml-2 font-mono text-gray-900 font-semibold">{job.ids}</span>
            </div>
            <div>
              <span className="text-gray-600">생성일:</span>
              <span className="ml-2 text-gray-800">{new Date(job.created_at).toLocaleDateString('ko-KR')}</span>
            </div>
            <div>
              <span className="text-gray-600">수정일:</span>
              <span className="ml-2 text-gray-800">{new Date(job.updated_at).toLocaleDateString('ko-KR')}</span>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
