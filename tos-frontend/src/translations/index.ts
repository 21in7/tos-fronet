import { ko, TranslationKeys } from './ko';
import { en } from './en';
import { ja } from './ja';
import { GameVersion } from '@/store/useLanguageStore';

// 모든 번역 데이터
export const translations: Record<GameVersion, TranslationKeys> = {
    ktos: ko,
    itos: en,
    jtos: ja,
};

// 중첩 객체에서 키 경로로 값 가져오기
type NestedKeyOf<T> = T extends object
    ? {
        [K in keyof T]: K extends string
        ? T[K] extends object
        ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
        : `${K}`
        : never;
    }[keyof T]
    : never;

export type TranslationKey = NestedKeyOf<TranslationKeys>;

// 경로로 중첩된 값 가져오기
function getNestedValue<T>(obj: T, path: string): string {
    const keys = path.split('.');
    let current: unknown = obj;

    for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
            current = (current as Record<string, unknown>)[key];
        } else {
            return path; // 키를 찾지 못하면 원래 경로 반환
        }
    }

    return typeof current === 'string' ? current : path;
}

// 번역 함수
export function getTranslation(version: GameVersion, key: string): string {
    return getNestedValue(translations[version], key);
}

// useTranslation 훅에서 사용할 타입
export type { TranslationKeys };
export { ko, en, ja };
