'use client';

import { useQuery } from '@tanstack/react-query';
import { attributesApi } from '@/lib/api';
import { Skill, Attribute } from '@/types/api';
import GameImage from '@/components/common/GameImage';

interface SkillTooltipProps {
    skill: Skill;
    currentLevel?: number; // 현재 할당된 스킬 레벨
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
    // 레벨은 1부터 시작, 배열은 0부터
    const index = Math.max(0, Math.min(level - 1, arr.length - 1));
    return arr[index];
};

export default function SkillTooltip({ skill, currentLevel = 0 }: SkillTooltipProps) {
    // Fetch attributes specifically for this skill using search
    const { data: attributesResponse, isLoading } = useQuery({
        queryKey: ['attributes', 'search', skill.name],
        queryFn: () => attributesApi.getAll({ search: skill.name, limit: 100 }),
        staleTime: 1000 * 60 * 60, // 1 hour stale time
        enabled: !!skill.name,
    });

    // Helper to format text with {nl} tags and strip game formatting
    const formatText = (text: string) => {
        if (!text) return null;
        // Remove {@...}, {#...}, {/} tags
        const cleanText = text.replace(/\{@.*?\}|\{#.*?\}|\{\/\}/g, '');

        return cleanText.split(/\{nl\}/g).map((line: string, i: number) => (
            <span key={i} className="block min-h-[1.2em]">
                {line}
            </span>
        ));
    };

    // Filter attributes to ensure they belong to this skill
    const rawAttributes = (attributesResponse?.data as Attribute[]) || [];
    const attributes = rawAttributes.filter(attr => {
        const normalize = (str: string) => str.replace(/^\[.*?\]\s*/, '').trim();
        const cleanAttrName = normalize(attr.name);
        return cleanAttrName === skill.name ||
            cleanAttrName.startsWith(`${skill.name}:`) ||
            cleanAttrName.startsWith(`${skill.name} `);
    });

    // 스킬 스탯 계산
    const displayLevel = currentLevel > 0 ? currentLevel : 1;
    const skillFactor = getValueAtLevel(skill.sfr, displayLevel);
    const captionRatio = getValueAtLevel(skill.captionratio1, displayLevel);
    const cooldownSec = skill.cooldown ? skill.cooldown / 1000 : null;
    const maxLevel = skill.max_lv || skill.max_level || skill.level || 5;

    return (
        <div className="absolute z-50 w-96 p-5 bg-gray-900/95 text-white rounded-xl shadow-2xl border border-gray-700 backdrop-blur-md -translate-y-full -mt-3 left-1/2 -translate-x-1/2 pointer-events-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-700/50">
                <GameImage
                    src={skill.icon || skill.icon_url}
                    alt={skill.name}
                    width={48}
                    height={48}
                    type="skill"
                    className="rounded-lg shadow-md ring-1 ring-gray-700"
                />
                <div>
                    <h4 className="font-bold text-xl text-yellow-400 tracking-tight">{skill.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-mono text-gray-500">ID: {skill.id}</span>
                        {currentLevel > 0 && (
                            <span className="text-xs font-bold text-indigo-400 bg-indigo-900/50 px-1.5 py-0.5 rounded">
                                Lv.{currentLevel}/{maxLevel}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="text-sm text-gray-300 mb-4 leading-relaxed space-y-1">
                {formatText(skill.descriptions || skill.description)}
            </div>

            {/* Skill Stats Section */}
            <div className="mb-4 p-3 bg-gray-800/60 rounded-lg border border-gray-700/50">
                <h5 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">
                    Skill Stats / 스킬 정보
                </h5>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                    {/* 스킬 계수 */}
                    {skillFactor !== null && (
                        <div className="col-span-2 flex justify-between items-center py-1 border-b border-gray-700/30">
                            <span className="text-gray-400">Skill Factor / 스킬 계수</span>
                            <span className="font-bold text-orange-400">{skillFactor.toLocaleString()}%</span>
                        </div>
                    )}
                    {/* 광역 공격 비율 */}
                    {captionRatio !== null && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-xs">AoE Ratio / 광역 비율</span>
                            <span className="font-semibold text-white">{captionRatio}</span>
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
            </div>

            {/* Attributes */}
            {isLoading ? (
                <div className="pt-3 border-t border-gray-700/50 text-xs text-gray-500 text-center animate-pulse">
                    Loading attributes...
                </div>
            ) : attributes.length > 0 && (
                <div className="pt-3 border-t border-gray-700/50">
                    <h5 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2 px-1">Attributes & Arts</h5>
                    <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1 customize-scrollbar">
                        {attributes.map(attr => (
                            <div key={attr.id} className="flex gap-3 bg-gray-800/40 p-2 rounded-lg border border-gray-700/30">
                                <GameImage
                                    src={attr.icon || attr.icon_url}
                                    alt={attr.name}
                                    width={32}
                                    height={32}
                                    type="attribute"
                                    className="rounded shrink-0 self-start"
                                />
                                <div className="min-w-0 flex-1">
                                    <div className="font-bold text-xs text-yellow-100 truncate mb-0.5">{attr.name}</div>
                                    <div className="text-[11px] text-gray-400 leading-snug">
                                        {formatText(attr.descriptions || attr.description || '')}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Arrow */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-900/95 drop-shadow-sm" />
        </div>
    );
}
