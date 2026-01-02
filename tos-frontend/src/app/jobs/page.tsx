'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { jobsApi, skillsApi } from '@/lib/api';
import { Job, Skill } from '@/types/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Pagination from '@/components/common/Pagination';
import { Briefcase, Zap, ChevronDown, ChevronUp, ExternalLink, Search, Filter } from 'lucide-react';
import GameImage from '@/components/common/GameImage';

const JOB_TYPES = [
  { id: 'Warrior', label: 'Warrior' },
  { id: 'Wizard', label: 'Wizard' },
  { id: 'Archer', label: 'Archer' },
  { id: 'Cleric', label: 'Cleric' },
  { id: 'Scout', label: 'Scout' },
];

export default function JobsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [expandedJobs, setExpandedJobs] = useState<Set<number>>(new Set());
  const [jobSkills, setJobSkills] = useState<Record<number, Skill[]>>({});

  // Search and Filter State
  const [inputValue, setInputValue] = useState(''); // Real-time input value
  const [searchQuery, setSearchQuery] = useState(''); // Debounced query for API
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
      if (inputValue !== searchQuery) {
        setCurrentPage(1); // Reset to first page on new search
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [inputValue, searchQuery]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', currentPage, limit, searchQuery, selectedType],
    queryFn: () => jobsApi.getAll({
      page: currentPage,
      limit,
      search: searchQuery || undefined,
      type: selectedType || undefined
    }),
  });

  const toggleJobSkills = async (jobId: number) => {
    const newExpanded = new Set(expandedJobs);

    if (expandedJobs.has(jobId)) {
      newExpanded.delete(jobId);
    } else {
      newExpanded.add(jobId);

      // 스킬 데이터가 없으면 로드
      if (!jobSkills[jobId]) {
        try {
          const skillsResponse = await skillsApi.getAll({ job_id: jobId, limit: 100 });
          setJobSkills(prev => ({
            ...prev,
            [jobId]: Array.isArray(skillsResponse.data) ? skillsResponse.data : []
          }));
        } catch (error) {
          console.error(`직업 ID ${jobId} 스킬 로드 오류:`, error);
          setJobSkills(prev => ({
            ...prev,
            [jobId]: []
          }));
        }
      }
    }

    setExpandedJobs(newExpanded);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleTypeSelect = (type: string | null) => {
    setSelectedType(type === selectedType ? null : type);
    setCurrentPage(1); // Reset to first page on filter
  };

  const jobs = data?.data as Job[];
  const pagination = data?.pagination;

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">직업</h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            게임 내 모든 직업 목록입니다.
          </p>
        </div>

        {/* Search and Filter Section - Always Visible */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {/* Show spinner in search icon if typing but not yet fetched */}
              {inputValue !== searchQuery ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
              ) : (
                <Search className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="직업 이름 검색..."
              value={inputValue}
              onChange={handleSearch}
            />
          </div>

          {/* Class Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <div className="flex items-center text-sm text-gray-500 flex-shrink-0">
              <Filter className="w-4 h-4 mr-1" />
              계열 필터:
            </div>
            {JOB_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors flex-shrink-0 ${selectedType === type.id
                  ? 'bg-indigo-100 text-indigo-800 ring-2 ring-indigo-500 ring-offset-1'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {type.label}
              </button>
            ))}
            {selectedType && (
              <button
                onClick={() => handleTypeSelect(null)}
                className="px-3 py-1 text-xs font-medium rounded-full bg-red-50 text-red-600 hover:bg-red-100"
              >
                초기화
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 text-lg font-semibold mb-2">
              직업 데이터를 불러올 수 없습니다
            </div>
            <div className="text-gray-600 mb-4">
              {(error as Error).message || 'API 서버가 실행 중인지 확인해주세요.'}
            </div>
            <div className="text-sm text-gray-500">
              데이터베이스 테이블이 생성되지 않았을 수 있습니다.
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {jobs && jobs.length > 0 ? jobs.map((job) => (
                <div key={job.id} className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <GameImage
                      src={job.icon_url}
                      alt={job.name}
                      width={48}
                      height={48}
                      className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16"
                      type="job"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Briefcase className="w-5 h-5 text-indigo-500" />
                          <Link href={`/jobs/${job.id}`}>
                            <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600 cursor-pointer">
                              {job.name}
                            </h3>
                          </Link>
                        </div>
                        <Link href={`/jobs/${job.id}`} className="text-gray-400 hover:text-indigo-600">
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {job.description}
                      </p>

                      {/* Job Tree 표시 */}
                      {job.job_tree && (
                        <div className="mt-3">
                          <div className="text-sm font-medium text-gray-700 mb-1">
                            직업 계열:
                          </div>
                          <div className="text-sm text-indigo-600 font-semibold">
                            {job.job_tree}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => toggleJobSkills(job.id)}
                          className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:bg-indigo-50 rounded-md transition-colors"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          직업 스킬 보기
                          {expandedJobs.has(job.id) ? (
                            <ChevronUp className="w-4 h-4 ml-2" />
                          ) : (
                            <ChevronDown className="w-4 h-4 ml-2" />
                          )}
                        </button>

                        {expandedJobs.has(job.id) && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-md">
                            <div className="text-sm font-medium text-gray-700 mb-2">
                              직업 관련 스킬:
                            </div>
                            {jobSkills[job.id] ? (
                              jobSkills[job.id].length > 0 ? (
                                <div className="space-y-2">
                                  {jobSkills[job.id].slice(0, 5).map((skill) => (
                                    <div key={skill.id} className="flex items-center space-x-2 text-sm">
                                      <div className="w-8 h-8">
                                        <GameImage
                                          src={skill.icon_url}
                                          alt={skill.name}
                                          width={32}
                                          height={32}
                                          type="skill"
                                        />
                                      </div>
                                      <div>
                                        <div className="font-medium text-gray-900">{skill.name}</div>
                                        <div className="text-gray-500 text-xs truncate max-w-xs">
                                          {skill.description}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  {jobSkills[job.id].length > 5 && (
                                    <div className="text-xs text-gray-500 text-center pt-2">
                                      ... 및 {jobSkills[job.id].length - 5}개 더
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-sm text-gray-500">
                                  관련 스킬을 찾을 수 없습니다.
                                </div>
                              )
                            ) : (
                              <div className="flex justify-center py-2">
                                <LoadingSpinner size="sm" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-500 text-lg">
                    {searchQuery || selectedType ? '검색 결과가 없습니다.' : '직업이 없습니다'}
                  </div>
                  <div className="text-gray-400 text-sm mt-2">
                    {searchQuery || selectedType ? '다른 검색어나 필터를 사용해보세요.' : '데이터베이스에 직업 데이터를 추가해주세요.'}
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
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}
