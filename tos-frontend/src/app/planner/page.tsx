'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '@/lib/api';

import ClassSelector from '@/components/planner/ClassSelector';
import SkillPanel from '@/components/planner/SkillPanel';
import { usePlannerStore } from '@/store/usePlannerStore';
import { Share2, RotateCcw } from 'lucide-react';


function PlannerContent() {
    const { selectedJobs, skillAllocations, resetAll, setJob, updateSkillLevel } = usePlannerStore();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Fetch all jobs to map IDs to objects
    const { data: jobsResponse } = useQuery({
        queryKey: ['jobs-all'],
        queryFn: () => jobsApi.getAll({ limit: 1000 }),
        staleTime: 1000 * 60 * 60,
    });

    // Initialize state from URL
    useEffect(() => {
        if (!jobsResponse?.data || !searchParams) return;

        const jobs = Array.isArray(jobsResponse.data) ? jobsResponse.data : [];
        if (jobs.length === 0) return;

        const urlJobs = searchParams.get('j');
        const urlSkills = searchParams.get('s');

        // Restore Jobs
        if (urlJobs) {
            const jobIds = urlJobs.split(',').map(id => parseInt(id.trim(), 10));
            // Only restore if we have valid IDs and it's not already set (or we force it)
            // Ideally check if store is empty or needs update. 
            // For now, if store is empty (all null) -> populate
            const currentEmpty = selectedJobs.every(j => j === null);

            if (currentEmpty && jobIds.length > 0) {
                jobIds.forEach((id, index) => {
                    if (isNaN(id)) return;
                    const jobObj = jobs.find(j => j.id === id);
                    if (jobObj && index < 4) {
                        setJob(index, jobObj);
                    }
                });
            }
        }

        // Restore Skills
        // Format: jobId-skillId-level.jobId-skillId-level...
        if (urlSkills) {
            const skillParts = urlSkills.split('.');
            skillParts.forEach(part => {
                const [jIdStr, sIdStr, lvlStr] = part.split('-');
                const jobId = parseInt(jIdStr, 10);
                const skillId = parseInt(sIdStr, 10);
                const level = parseInt(lvlStr, 10);

                if (!isNaN(jobId) && !isNaN(skillId) && !isNaN(level)) {
                    updateSkillLevel(jobId, skillId, level);
                }
            });
        }
        // We only want to run this once on mount/data load, not on every store change
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobsResponse, searchParams]); // Dependencies: data and params

    // URL State Sync (Write)
    const handleCopyLink = () => {
        // Serialization
        const jobIds = selectedJobs.map(j => j ? j.id : '').join(',');
        const skillParts: string[] = [];

        Object.entries(skillAllocations).forEach(([jobId, skills]) => {
            Object.entries(skills).forEach(([skillId, level]) => {
                if (level > 0) {
                    skillParts.push(`${jobId}-${skillId}-${level}`);
                }
            });
        });

        const queryString = new URLSearchParams();
        if (jobIds.replace(/,/g, '')) queryString.set('j', jobIds);
        if (skillParts.length > 0) queryString.set('s', skillParts.join('.'));

        const shareUrl = `${window.location.origin}${window.location.pathname}?${queryString.toString()}`;

        navigator.clipboard.writeText(shareUrl)
            .then(() => alert('빌드 링크가 복사되었습니다!'))
            .catch(() => alert('링크 복사에 실패했습니다.'));

        // Also update current URL without reload
        router.replace(`?${queryString.toString()}`, { scroll: false });
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">캐릭터 플래너</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        직업을 선택하고 스킬 포인트를 투자하여 나만의 빌드를 만들어보세요.
                    </p>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={resetAll}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        초기화
                    </button>
                    <button
                        onClick={handleCopyLink}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        <Share2 className="w-4 h-4 mr-2" />
                        빌드 공유
                    </button>
                </div>
            </div>

            {/* Class Selector */}
            <ClassSelector />

            {/* Skill Panels */}
            <div className="space-y-6">
                {selectedJobs.map((job, index) => (
                    job ? (
                        <SkillPanel key={`${job.id}-${index}`} job={job} slotIndex={index} />
                    ) : null
                ))}

                {selectedJobs.every(j => j === null) && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <p className="text-gray-500">상단에서 첫 번째 직업(Base Class)을 선택해주세요.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PlannerPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PlannerContent />
        </Suspense>
    );
}
