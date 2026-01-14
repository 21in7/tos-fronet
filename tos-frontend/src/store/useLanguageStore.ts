'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GameVersion = 'ktos' | 'itos' | 'jtos';

interface LanguageState {
  gameVersion: GameVersion;
  setGameVersion: (version: GameVersion) => void;
}

// 게임 버전에 따른 UI 언어 매핑
export const VERSION_LANGUAGE_MAP: Record<GameVersion, string> = {
  ktos: 'ko',
  itos: 'en',
  jtos: 'ja',
};

// 게임 버전별 표시 정보
export const VERSION_INFO: Record<GameVersion, { label: string; flag: string; name: string }> = {
  ktos: { label: 'KR', flag: '🇰🇷', name: 'kTOS' },
  itos: { label: 'EN', flag: '🇺🇸', name: 'iTOS' },
  jtos: { label: 'JP', flag: '🇯🇵', name: 'jTOS' },
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      gameVersion: 'ktos',
      setGameVersion: (version) => set({ gameVersion: version }),
    }),
    {
      name: 'language-storage',
    }
  )
);
