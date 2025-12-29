'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { skillsApi } from '@/lib/api';
import { Job, Skill } from '@/types/api';
import { usePlannerStore } from '@/store/usePlannerStore';
import GameImage from '@/components/common/GameImage';
import { Plus, Minus } from 'lucide-react';

interface SkillPanelProps {
    job: Job;
    slotIndex: number;
}

export default function SkillPanel({ job, slotIndex }: SkillPanelProps) {
    const { skillAllocations, updateSkillLevel, getAllocatedSp } = usePlannerStore();

    const { data: skillsResponse, isLoading } = useQuery({
        queryKey: ['skills', job.id],
        queryFn: () => skillsApi.getAll({ job_id: job.id, limit: 100 }),
        staleTime: 1000 * 60 * 60,
    });

    const skills = useMemo(() => {
        if (!skillsResponse?.data || !Array.isArray(skillsResponse.data)) return [];
        return skillsResponse.data;
    }, [skillsResponse]);

    const allocatedSp = getAllocatedSp(job.id);
    const maxSp = slotIndex === 0 ? 15 : 66; // 15 for base, 66 for sub

    // Also need to know max level per skill. Usually 5, 10, or 15.
    // The API response for Skill has `level` which might be max level? 
    // checking types/api.ts: `max_lv` in Attribute/Buff, but Skill has `level`.
    // Wait, Skill interface in types/api.ts has `level?: number`. 
    // This might be the max level. Or `max_level`? 
    // Let's assume `level` is the max level. If undefined, default to 5.

    const handleUpdateLevel = (skill: Skill, delta: number) => {
        const currentLevel = skillAllocations[job.id]?.[skill.id] || 0;
        const maxFunctionLevel = skill.level || 5; // Default to 5 if unknown
        const nextLevel = currentLevel + delta;

        // Check bounds
        if (nextLevel < 0) return;
        if (nextLevel > maxFunctionLevel) return;

        // Check SP budget
        // If increasing, check if we have SP
        if (delta > 0 && allocatedSp >= maxSp) {
            return;
        }

        updateSkillLevel(job.id, skill.id, nextLevel);
    };

    if (isLoading) {
        return <div className="p-6 text-center text-gray-500">스킬 로딩 중...</div>;
    }

    if (skills.length === 0) {
        return <div className="p-6 text-center text-gray-500">스킬 데이터가 없습니다.</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <GameImage
                        src={job.icon_url}
                        alt={job.name}
                        width={32}
                        height={32}
                        type="job"
                    />
                    <h3 className="text-lg font-bold text-gray-900">{job.name}</h3>
                </div>

                <div className="flex items-center space-x-2">
                    <span className={`font-mono font-bold text-lg ${allocatedSp > maxSp ? 'text-red-600' : 'text-indigo-600'}`}>
                        {allocatedSp}
                    </span>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-600 font-medium">{maxSp}</span>
                    <span className="text-xs text-gray-500 ml-1">SP</span>
                </div>
            </div>

            {/* Skills Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((skill) => {
                    const currentLevel = skillAllocations[job.id]?.[skill.id] || 0;
                    // Assuming skill object has max level in 'level' property. 
                    // We might need to fallback if API doesn't provide it clearly.
                    const maxLevel = skill.level || 15; // Usually 5, 10, or 15

                    return (
                        <div key={skill.id} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                            <div className="relative group">
                                <GameImage
                                    src={skill.icon_url}
                                    alt={skill.name}
                                    width={48}
                                    height={48}
                                    type="skill"
                                />
                                {/* Tooltip could go here */}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate" title={skill.name}>
                                    {skill.name}
                                </div>

                                <div className="mt-2 flex items-center justify-between">
                                    <div className="text-xs text-gray-500">
                                        Lv. {currentLevel} / {maxLevel}
                                    </div>

                                    <div className="flex items-center space-x-1">
                                        <button
                                            onClick={() => handleUpdateLevel(skill, -1)}
                                            disabled={currentLevel <= 0}
                                            className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <button
                                            onClick={() => handleUpdateLevel(skill, 1)}
                                            disabled={currentLevel >= maxLevel || allocatedSp >= maxSp}
                                            className="p-1 rounded bg-indigo-100 hover:bg-indigo-200 text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
