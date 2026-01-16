'use client';

import { useState } from 'react';
import { Attribute } from '@/types/api';
import GameImage from '@/components/common/GameImage';

interface AttributeTooltipProps {
    attribute: Attribute;
}

export default function AttributeTooltip({ attribute }: AttributeTooltipProps) {
    // Helper to format text with {nl} tags and strip game formatting
    const formatText = (text: string) => {
        if (!text) return null;
        const cleanText = text.replace(/\{@.*?\}|\{#.*?\}|\{\/\}/g, '');
        return cleanText.split(/\{nl\}/g).map((line: string, i: number) => (
            <span key={i} className="block min-h-[1.2em]">
                {line}
            </span>
        ));
    };

    return (
        <div className="absolute z-[60] w-80 p-4 bg-gray-900/95 text-white rounded-xl shadow-2xl border border-gray-700 backdrop-blur-md -translate-y-full -mt-2 left-1/2 -translate-x-1/2 pointer-events-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-700/50">
                <GameImage
                    src={attribute.icon || attribute.icon_url}
                    alt={attribute.name}
                    width={36}
                    height={36}
                    type="attribute"
                    className="rounded-lg shadow-md ring-1 ring-gray-700"
                />
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-yellow-400 leading-tight">{attribute.name}</h4>
                    {attribute.max_lv && attribute.max_lv > 1 && (
                        <span className="text-xs text-gray-400">Max Lv. {attribute.max_lv}</span>
                    )}
                </div>
            </div>

            {/* Description */}
            <div className="text-xs text-gray-300 leading-relaxed space-y-1">
                {formatText(attribute.descriptions || attribute.description || '')}
            </div>

            {/* Arrow */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-full w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-gray-900/95 drop-shadow-sm" />
        </div>
    );
}

// 작은 특성 아이콘 컴포넌트 (호버 시 툴팁 표시)
interface AttributeIconProps {
    attribute: Attribute;
}

export function AttributeIcon({ attribute }: AttributeIconProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <GameImage
                src={attribute.icon || attribute.icon_url}
                alt={attribute.name}
                width={24}
                height={24}
                type="attribute"
                className="w-5 h-5 rounded cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all"
            />
            {isHovered && <AttributeTooltip attribute={attribute} />}
        </div>
    );
}
