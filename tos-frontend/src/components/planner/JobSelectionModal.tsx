'use client';

import { Fragment, useState, useMemo } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '@/lib/api';
import { Job, QueryParams, ApiResponse } from '@/types/api';
import GameImage from '@/components/common/GameImage';
import { Search, X } from 'lucide-react';

interface JobSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (job: Job) => void;
    slotIndex: number;
    baseJob?: Job | null; // To filter by tree if needed
}

export default function JobSelectionModal({
    isOpen,
    onClose,
    onSelect,
    slotIndex,
    baseJob
}: JobSelectionModalProps) {
    const [searchQuery, setSearchQuery] = useState('');

    // Determine query parameters based on slot index
    const isBaseClassSelection = slotIndex === 0;

    // Fetch jobs using is_starter filter from API
    const { data: jobsResponse, isLoading } = useQuery({
        queryKey: ['jobs', isBaseClassSelection ? 'starter' : 'advanced', baseJob?.job_tree],
        queryFn: async () => {
            if (isBaseClassSelection) {
                // Fetch only base classes
                return jobsApi.getAll({ is_starter: true, limit: 100 });
            } else {
                // Fetch ALL advanced classes manually because API enforces pagination limit (50)
                // and API filtering might be unreliable. We fetch everything page by page.
                const allJobs: Job[] = [];
                let page = 1;
                let hasNext = true;
                let lastResponse: ApiResponse<Job[]> | null = null;

                // Fetch sub-jobs tree
                // To be safe, we try to fetch as much as possible.
                // If API filtering by job_tree works later, this loop will just be shorter.
                const baseParams: QueryParams = { is_starter: false, limit: 100 };
                if (baseJob?.job_tree) {
                    baseParams.job_tree = baseJob.job_tree;
                }

                while (hasNext) {
                    const res = await jobsApi.getAll<Job[]>({ ...baseParams, page });
                    lastResponse = res;

                    if (res.data && Array.isArray(res.data)) {
                        allJobs.push(...res.data);
                    }

                    // Check for next page
                    // DRF returns 'next' url string if there is a next page, our adapter sets hasNext
                    if (res.pagination?.hasNext) {
                        page++;
                    } else {
                        hasNext = false;
                    }

                    // Safety break to prevent infinite loops in case of API issues
                    if (page > 20) break;
                }

                console.log('Fetched all sub-jobs:', {
                    tree: baseJob?.job_tree,
                    totalFetched: allJobs.length,
                    apiTotal: lastResponse?.pagination?.total
                });

                // Return constructed response
                return {
                    success: true,
                    message: "Fetched all pages",
                    timestamp: lastResponse?.timestamp || new Date().toISOString(),
                    data: allJobs,
                    pagination: {
                        page: 1,
                        limit: allJobs.length,
                        total: allJobs.length,
                        totalPages: 1,
                        hasNext: false,
                        hasPrev: false
                    }
                };
            }
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    });

    const filteredJobs = useMemo(() => {
        if (!jobsResponse?.data || !Array.isArray(jobsResponse.data)) return [];
        return jobsResponse.data.filter((job: Job) => {
            // 1. Search filter
            if (searchQuery) {
                const matchesSearch = job.name.toLowerCase().includes(searchQuery.toLowerCase());
                if (!matchesSearch) return false;
            }

            // 2. Job Tree Filter (Client-side fallback)
            // Even if API filters, double check or essential if API doesn't support job_tree filter yet
            if (baseJob?.job_tree && job.job_tree) {
                return job.job_tree === baseJob.job_tree;
            }

            return true;
        });
    }, [jobsResponse, searchQuery, baseJob]);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all h-[80vh] flex flex-col">
                                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                        직업 선택 {isBaseClassSelection ? '(Base)' : `(${baseJob?.name || 'Sub'})`}
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="mb-4 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="직업 검색..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-4 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto p-1 flex-1">
                                    {isLoading ? (
                                        <div className="col-span-full text-center py-8 text-gray-500">
                                            로딩 중...
                                        </div>
                                    ) : filteredJobs.length > 0 ? (
                                        filteredJobs.map((job) => (
                                            <button
                                                key={job.id}
                                                onClick={() => onSelect(job)}
                                                className="flex flex-col items-center p-2 sm:p-3 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors group"
                                            >
                                                <GameImage
                                                    src={job.icon || job.icon_url}
                                                    alt={job.name}
                                                    width={40}
                                                    height={40}
                                                    type="job"
                                                    className="mb-1 sm:mb-2 w-8 h-8 sm:w-12 sm:h-12 group-hover:scale-110 transition-transform"
                                                />
                                                <span className="text-xs sm:text-sm font-medium text-gray-900 text-center line-clamp-1">
                                                    {job.name}
                                                </span>
                                                <span className="text-xs text-gray-500 mt-0.5 sm:mt-1 hidden sm:block">
                                                    {job.job_tree}
                                                </span>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-8 text-gray-500">
                                            검색 결과가 없습니다.
                                        </div>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
