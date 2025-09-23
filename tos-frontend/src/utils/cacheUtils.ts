import { cleanImageCache } from '@/hooks/useImageCache';

// 앱 시작 시 캐시 정리
export function initializeCache() {
  // 만료된 이미지 캐시 정리
  cleanImageCache();
  
  // 기타 캐시 정리 작업
  console.log('🧹 캐시 초기화 완료');
}

// 캐시 상태 확인
export function getCacheInfo() {
  try {
    const cache = localStorage.getItem('game-images-cache');
    if (!cache) return { count: 0, size: 0 };
    
    const parsedCache = JSON.parse(cache);
    const size = new Blob([cache]).size;
    
    return {
      count: parsedCache.length,
      size: Math.round(size / 1024), // KB 단위
    };
  } catch (error) {
    console.error('캐시 정보 조회 실패:', error);
    return { count: 0, size: 0 };
  }
}

// 캐시 전체 삭제
export function clearAllCache() {
  try {
    localStorage.removeItem('game-images-cache');
    console.log('🗑️ 모든 캐시 삭제 완료');
  } catch (error) {
    console.error('캐시 삭제 실패:', error);
  }
}
