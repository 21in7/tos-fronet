'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useLanguageStore, VERSION_LANGUAGE_MAP } from '@/store/useLanguageStore';

interface LanguageProviderProps {
    children: ReactNode;
}

export default function LanguageProvider({ children }: LanguageProviderProps) {
    const { gameVersion } = useLanguageStore();
    const [mounted, setMounted] = useState(false);

    // 클라이언트 마운트 후 HTML lang 속성 업데이트
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            const lang = VERSION_LANGUAGE_MAP[gameVersion];
            document.documentElement.lang = lang;
        }
    }, [gameVersion, mounted]);

    return <>{children}</>;
}
