'use client';

import { useLanguageStore } from '@/store/useLanguageStore';
import { translations, TranslationKeys } from '@/translations';

// useTranslation 훅
export function useTranslation() {
    const { gameVersion } = useLanguageStore();
    const t = translations[gameVersion];

    // 경로 기반 번역 함수 (예: t('nav.dashboard'))
    function translate(path: string): string {
        const keys = path.split('.');
        let current: unknown = t;

        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = (current as Record<string, unknown>)[key];
            } else {
                return path; // 키를 찾지 못하면 원래 경로 반환
            }
        }

        return typeof current === 'string' ? current : path;
    }

    return {
        t, // 전체 번역 객체 (직접 접근용: t.nav.dashboard)
        translate, // 경로 기반 함수 (문자열 키 사용: translate('nav.dashboard'))
        gameVersion,
    };
}

export type { TranslationKeys };
