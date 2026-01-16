'use client';

import { useQuery } from '@tanstack/react-query';
import { attributesApi } from '@/lib/api';
import { Skill, Attribute } from '@/types/api';
import GameImage from '@/components/common/GameImage';

interface SkillTooltipProps {
    skill: Skill;
    // attributes prop removed as we fetch internally
}

export default function SkillTooltip({ skill }: SkillTooltipProps) {
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
        const cleanText = text.replace(/{@.*?}|{#.*?}|{\/}/g, '');

        return cleanText.split(/{nl}/g).map((line, i) => (
            <span key={i} className="block min-h-[1.2em]">
                {line}
            </span>
        ));
    };

    // Filter attributes to ensure they belong to this skill
    // The API search might return items that mention the skill in description but belong to others
    const rawAttributes = (attributesResponse?.data as Attribute[]) || [];
    const attributes = rawAttributes.filter(attr => {
        // Normalize attribute name: remove [Arts] or [Anything] prefix
        const normalize = (str: string) => str.replace(/^\[.*?\]\s*/, '').trim();
        const cleanAttrName = normalize(attr.name);

        // Strict Check:
        // 1. Exact match (rare but possible)
        // 2. Starts with "SkillName:" (Standard ToS format for attributes)
        // 3. Starts with "SkillName " (Safety fallback if colon is missing)
        return cleanAttrName === skill.name ||
            cleanAttrName.startsWith(`${skill.name}:`) ||
            cleanAttrName.startsWith(`${skill.name} `);
    });

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
                    <span className="text-xs font-mono text-gray-500">ID: {skill.id}</span>
                </div>
            </div>

            {/* Description */}
            <div className="text-sm text-gray-300 mb-6 leading-relaxed space-y-1">
                {formatText(skill.descriptions || skill.description)}
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
