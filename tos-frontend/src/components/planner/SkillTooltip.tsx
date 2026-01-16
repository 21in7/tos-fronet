'use client';

import { Skill } from '@/types/api';
import GameImage from '@/components/common/GameImage';

interface SkillTooltipProps {
    skill: Skill;
    currentLevel?: number;
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

// 현재 레벨에 해당하는 값 가져오기
const getValueAtLevel = (jsonStr: string | null | undefined, level: number): number | null => {
    const arr = parseJsonArray(jsonStr);
    if (arr.length === 0) return null;
    const index = Math.max(0, Math.min(level - 1, arr.length - 1));
    return arr[index];
};

export default function SkillTooltip({ skill, currentLevel = 0 }: SkillTooltipProps) {
    // 스킬 스탯 계산
    const displayLevel = currentLevel > 0 ? currentLevel : 1;
    const skillFactor = getValueAtLevel(skill.sfr, displayLevel);
    const cooldownSec = skill.cooldown ? skill.cooldown / 1000 : null;
    const maxLevel = skill.max_lv || skill.max_level || skill.level || 5;

    return (
        <div className="absolute z-50 w-72 p-4 bg-gray-900/95 text-white rounded-xl shadow-2xl border border-gray-700 backdrop-blur-md -translate-y-full -mt-3 left-1/2 -translate-x-1/2 pointer-events-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-700/50">
                <GameImage
                    src={skill.icon || skill.icon_url}
                    alt={skill.name}
                    width={40}
                    height={40}
                    type="skill"
                    className="rounded-lg shadow-md ring-1 ring-gray-700"
                />
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-base text-yellow-400 truncate">{skill.name}</h4>
                    {currentLevel > 0 && (
                        <span className="text-xs font-bold text-indigo-400">
                            Lv.{currentLevel}/{maxLevel}
                        </span>
                    )}
                </div>
            </div>

            {/* Skill Stats - Compact Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {/* 스킬 계수 */}
                {skillFactor !== null && (
                    <div className="col-span-2 flex justify-between items-center py-1.5 bg-gray-800/50 rounded px-2">
                        <span className="text-gray-400 text-xs">Skill Factor / 스킬 계수</span>
                        <span className="font-bold text-orange-400">{skillFactor.toLocaleString()}%</span>
                    </div>
                )}
                {/* SP */}
                {skill.sp !== undefined && skill.sp !== null && (
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-xs">SP</span>
                        <span className="font-semibold text-blue-400">{skill.sp}</span>
                    </div>
                )}
                {/* 쿨다운 */}
                {cooldownSec !== null && (
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-xs">Cooldown / 쿨다운</span>
                        <span className="font-semibold text-white">{cooldownSec}s</span>
                    </div>
                )}
                {/* 오버히트 */}
                {skill.overheat !== undefined && skill.overheat !== null && (
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-xs">Overheat / 오버히트</span>
                        <span className="font-semibold text-white">{skill.overheat}</span>
                    </div>
                )}
            </div>

            {/* Arrow */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-900/95 drop-shadow-sm" />
        </div>
    );
}
