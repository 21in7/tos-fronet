import { useState, useEffect } from 'react';

interface CachedImage {
  src: string;
  dataUrl: string;
  timestamp: number;
}

const CACHE_KEY = 'game-images-cache';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7일

export function useImageCache(src?: string) {
  const [cachedSrc, setCachedSrc] = useState<string | undefined>(src);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) {
      setCachedSrc(undefined);
      return;
    }

    // 로컬 스토리지에서 캐시 확인
    const cached = getCachedImage(src);
    if (cached) {
      setCachedSrc(cached);
      return;
    }

    // 캐시에 없으면 이미지 다운로드 및 캐시
    setIsLoading(true);
    setError(false);

    // CORS 문제로 인해 직접 fetch 대신 Next.js Image 컴포넌트에 의존
    // 캐시는 브라우저의 기본 캐싱에 의존하고, 로컬 스토리지에는 URL만 저장
    setCachedSrc(src);

    // 로컬 스토리지에 이미지 URL 캐시 정보만 저장 (실제 이미지 데이터는 저장하지 않음)
    cacheImageUrl(src);

    setIsLoading(false);
  }, [src]);

  return { cachedSrc, isLoading, error };
}

function getCachedImage(src: string): string | null {
  try {
    const cache = localStorage.getItem(CACHE_KEY);
    if (!cache) return null;

    const parsedCache: CachedImage[] = JSON.parse(cache);
    const cached = parsedCache.find(item => item.src === src);

    if (!cached) return null;

    // 만료 확인
    if (Date.now() - cached.timestamp > CACHE_EXPIRY) {
      removeCachedImage(src);
      return null;
    }

    return cached.dataUrl;
  } catch (error) {
    console.error('캐시 읽기 실패:', error);
    return null;
  }
}

function cacheImageUrl(src: string) {
  try {
    const cache = localStorage.getItem(CACHE_KEY);
    const parsedCache: CachedImage[] = cache ? JSON.parse(cache) : [];

    // 기존 캐시 제거
    const filteredCache = parsedCache.filter(item => item.src !== src);

    // 새 캐시 추가 (URL만 저장)
    const newCache = [
      ...filteredCache,
      { src, dataUrl: src, timestamp: Date.now() }
    ];

    // 캐시 크기 제한 (최대 50개)
    if (newCache.length > 50) {
      newCache.sort((a, b) => b.timestamp - a.timestamp);
      newCache.splice(50);
    }

    localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
  } catch (error) {
    console.error('캐시 저장 실패:', error);
  }
}

// function cacheImage(src: string, dataUrl: string) {
//   try {
//     const cache = localStorage.getItem(CACHE_KEY);
//     const parsedCache: CachedImage[] = cache ? JSON.parse(cache) : [];
//     
//     // 기존 캐시 제거
//     const filteredCache = parsedCache.filter(item => item.src !== src);
//     
//     // 새 캐시 추가
//     const newCache = [
//       ...filteredCache,
//       { src, dataUrl, timestamp: Date.now() }
//     ];
// 
//     // 캐시 크기 제한 (최대 50개)
//     if (newCache.length > 50) {
//       newCache.sort((a, b) => b.timestamp - a.timestamp);
//       newCache.splice(50);
//     }
// 
//     localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
//   } catch (error) {
//     console.error('캐시 저장 실패:', error);
//   }
// }

function removeCachedImage(src: string) {
  try {
    const cache = localStorage.getItem(CACHE_KEY);
    if (!cache) return;

    const parsedCache: CachedImage[] = JSON.parse(cache);
    const filteredCache = parsedCache.filter(item => item.src !== src);
    localStorage.setItem(CACHE_KEY, JSON.stringify(filteredCache));
  } catch (error) {
    console.error('캐시 제거 실패:', error);
  }
}

// 캐시 정리 함수 (만료된 항목 제거)
export function cleanImageCache() {
  try {
    const cache = localStorage.getItem(CACHE_KEY);
    if (!cache) return;

    const parsedCache: CachedImage[] = JSON.parse(cache);
    const now = Date.now();
    const validCache = parsedCache.filter(item => now - item.timestamp <= CACHE_EXPIRY);

    localStorage.setItem(CACHE_KEY, JSON.stringify(validCache));
  } catch (error) {
    console.error('캐시 정리 실패:', error);
  }
}
