'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { skillsApi } from '@/lib/api';
import { Job, Skill } from '@/types/api';
import { usePlannerStore } from '@/store/usePlannerStore';
import GameImage from '@/components/common/GameImage';
import { Plus, Minus } from 'lucide-react';
import SkillTooltip from './SkillTooltip';

interface SkillPanelProps {
    job: Job;
    slotIndex: number;
}

export default function SkillPanel({ job, slotIndex }: SkillPanelProps) {
    const { skillAllocations, updateSkillLevel, getAllocatedSp } = usePlannerStore();
    const [hoveredSkillId, setHoveredSkillId] = useState<number | null>(null);

    // Fetch Skills
    const { data: skillsResponse, isLoading: isSkillsLoading } = useQuery({
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

    // Helper to determine max level of a skill
    // Checks multiple potential properties for robustness
    const getMaxLevel = (skill: Skill): number => {
        // 1. Check specific max_level properties if available
        if (skill.max_level) return skill.max_level;
        if (skill.max_lv) return skill.max_lv;

        // 2. Fallback to `level` if it seems to represent max level (common in some APIs)
        // But be careful, sometimes `level` might be current level (though usually static data implies max)
        if (skill.level) return skill.level;

        // 3. Absolute fallback
        return 5; // Safe default
    };

    const handleUpdateLevel = (skill: Skill, delta: number, e?: React.MouseEvent) => {
        const currentLevel = skillAllocations[job.id]?.[skill.id] || 0;
        const maxFunctionLevel = getMaxLevel(skill);

        let change = delta;

        // Shift+Click for Max Level (only for increasing)
        if (delta > 0 && e?.shiftKey) {
            const remainingLevel = maxFunctionLevel - currentLevel;
            const remainingSp = maxSp - allocatedSp;
            change = Math.min(remainingLevel, remainingSp);

            // If we can't add anything, just return
            if (change <= 0) return;
        }

        const nextLevel = currentLevel + change;

        // Check bounds
        if (nextLevel < 0) return;
        if (nextLevel > maxFunctionLevel) return;

        // Check SP budget
        // If increasing, check if we have SP
        // Note: For shift-click, 'change' is calculated to fit in SP, so this check passes.
        // For normal click, change=1, so if allocatedSp >= maxSp, we return.
        if (change > 0 && (allocatedSp + change - delta) >= maxSp) {
            // Logic correction: 
            // Normal click: delta=1. If allocatedSp >= maxSp, return.
            // Shift click: change=N. We ensured allocatedSp + N <= maxSp.
            // But wait, standard check for normal click `allocatedSp >= maxSp` works if we add 1.
            // Let's use a simpler check:
            if (allocatedSp + change > maxSp) return;
        }

        updateSkillLevel(job.id, skill.id, nextLevel);
    };

    if (isSkillsLoading) {
        return <div className="p-6 text-center text-gray-500">스킬 로딩 중...</div>;
    }

    if (skills.length === 0) {
        return <div className="p-6 text-center text-gray-500">스킬 데이터가 없습니다.</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center rounded-t-lg">
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
                    const maxLevel = getMaxLevel(skill);
                    const isHovered = hoveredSkillId === skill.id;

                    return (
                        <div key={skill.id} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                            <div
                                className="relative group"
                                onMouseEnter={() => setHoveredSkillId(skill.id)}
                                onMouseLeave={() => setHoveredSkillId(null)}
                            >
                                <GameImage
                                    src={skill.icon_url}
                                    alt={skill.name}
                                    width={48}
                                    height={48}
                                    type="skill"
                                />
                                {isHovered && (
                                    <SkillTooltip skill={skill} />
                                )}
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
                                            onClick={(e) => handleUpdateLevel(skill, 1, e)}
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
