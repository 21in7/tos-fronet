'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { skillsApi, attributesApi } from '@/lib/api';
import { Job, Skill, Attribute } from '@/types/api';
import { usePlannerStore } from '@/store/usePlannerStore';
import GameImage from '@/components/common/GameImage';
import { Plus, Minus } from 'lucide-react';
import SkillTooltip from './SkillTooltip';
import { AttributeIcon } from './AttributeTooltip';

interface SkillPanelProps {
    job: Job;
    slotIndex: number;
}

// 스킬 계수 배열 파싱 헬퍼
const parseJsonArray = (jsonStr: string | null | undefined): number[] => {
    if (!jsonStr) return [];
    try {
        return JSON.parse(jsonStr);
    } catch {
        return [];
    }
};

// 현재 레벨에 해당하는 스킬 계수 가져오기
const getSkillFactorAtLevel = (sfr: string | null | undefined, level: number): number | null => {
    const arr = parseJsonArray(sfr);
    if (arr.length === 0) return null;
    const index = Math.max(0, Math.min(level - 1, arr.length - 1));
    return arr[index];
};

export default function SkillPanel({ job, slotIndex }: SkillPanelProps) {
    const { skillAllocations, updateSkillLevel, getAllocatedSp } = usePlannerStore();
    const [hoveredSkillId, setHoveredSkillId] = useState<number | null>(null);

    // Fetch Skills
    const { data: skillsResponse, isLoading: isSkillsLoading } = useQuery({
        queryKey: ['skills', job.id],
        queryFn: () => skillsApi.getAll({ job_id: job.id, limit: 100 }),
        staleTime: 1000 * 60 * 60,
    });

    // Fetch all attributes (we'll filter by skill name on the frontend)
    const { data: attributesResponse } = useQuery({
        queryKey: ['attributes', 'all'],
        queryFn: () => attributesApi.getAll({ limit: 1000 }),
        staleTime: 1000 * 60 * 60,
    });

    const skills = useMemo(() => {
        if (!skillsResponse?.data || !Array.isArray(skillsResponse.data)) return [];
        return skillsResponse.data.filter((skill: Skill) =>
            skill.job && skill.job.id === job.id
        );
    }, [skillsResponse, job.id]);

    // 스킬별 특성 매핑 (API의 skill 배열을 활용)
    const skillAttributesMap = useMemo(() => {
        const map: Record<number, Attribute[]> = {};
        const allAttributes = (attributesResponse?.data as Attribute[]) || [];

        // 각 특성의 skill 배열에서 스킬 ID를 확인하여 매핑
        allAttributes.forEach(attr => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const linkedSkills = (attr as any).skill as Array<{ id: number }> | undefined;
            if (linkedSkills && Array.isArray(linkedSkills)) {
                linkedSkills.forEach(linkedSkill => {
                    // 현재 직업의 스킬인지 확인
                    const matchingSkill = skills.find((s: Skill) => s.id === linkedSkill.id);
                    if (matchingSkill) {
                        if (!map[matchingSkill.id]) {
                            map[matchingSkill.id] = [];
                        }
                        map[matchingSkill.id].push(attr);
                    }
                });
            }
        });

        return map;
    }, [skills, attributesResponse]);

    const allocatedSp = getAllocatedSp(job.id);
    const maxSp = slotIndex === 0 ? 15 : 66;

    const getMaxLevel = (skill: Skill): number => {
        if (skill.max_level) return skill.max_level;
        if (skill.max_lv) return skill.max_lv;
        if (skill.level) return skill.level;
        return 5;
    };

    const handleUpdateLevel = (skill: Skill, delta: number, e?: React.MouseEvent) => {
        const currentLevel = skillAllocations[job.id]?.[skill.id] || 0;
        const maxFunctionLevel = getMaxLevel(skill);

        let change = delta;

        if (delta > 0 && e?.shiftKey) {
            const remainingLevel = maxFunctionLevel - currentLevel;
            const remainingSp = maxSp - allocatedSp;
            change = Math.min(remainingLevel, remainingSp);
            if (change <= 0) return;
        }

        const nextLevel = currentLevel + change;

        if (nextLevel < 0) return;
        if (nextLevel > maxFunctionLevel) return;
        if (change > 0 && allocatedSp + change > maxSp) return;

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
            <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex justify-between items-center rounded-t-lg">
                <div className="flex items-center space-x-3">
                    <GameImage
                        src={job.icon || job.icon_url}
                        alt={job.name}
                        width={32}
                        height={32}
                        type="job"
                    />
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">{job.name}</h3>
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
            <div className="p-4 sm:p-6 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                {skills.map((skill) => {
                    const currentLevel = skillAllocations[job.id]?.[skill.id] || 0;
                    const maxLevel = getMaxLevel(skill);
                    const isHovered = hoveredSkillId === skill.id;
                    const attributes = skillAttributesMap[skill.id] || [];
                    const skillFactor = currentLevel > 0 ? getSkillFactorAtLevel(skill.sfr, currentLevel) : null;

                    return (
                        <div key={skill.id} className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                            <div
                                className="relative group shrink-0"
                                onMouseEnter={() => setHoveredSkillId(skill.id)}
                                onMouseLeave={() => setHoveredSkillId(null)}
                            >
                                <GameImage
                                    src={skill.icon || skill.icon_url}
                                    alt={skill.name}
                                    width={40}
                                    height={40}
                                    type="skill"
                                    className="w-10 h-10 sm:w-12 sm:h-12"
                                />
                                {isHovered && (
                                    <SkillTooltip skill={skill} currentLevel={currentLevel} />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                {/* Skill Name */}
                                <div className="text-sm font-medium text-gray-900 truncate" title={skill.name}>
                                    {skill.name}
                                </div>

                                {/* Attribute Icons Row */}
                                {attributes.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {attributes.slice(0, 4).map(attr => (
                                            <AttributeIcon key={attr.id} attribute={attr} />
                                        ))}
                                        {attributes.length > 4 && (
                                            <span className="text-xs text-gray-400 self-center">+{attributes.length - 4}</span>
                                        )}
                                    </div>
                                )}

                                {/* Level & Controls */}
                                <div className="mt-2 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500">
                                            Lv. {currentLevel} / {maxLevel}
                                        </span>
                                        {/* Show skill factor if level > 0 */}
                                        {skillFactor !== null && (
                                            <span className="text-xs font-semibold text-orange-500">
                                                {skillFactor.toLocaleString()}%
                                            </span>
                                        )}
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
