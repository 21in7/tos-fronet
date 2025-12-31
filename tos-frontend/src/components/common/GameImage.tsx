import Image from 'next/image';
import { useState, useEffect } from 'react';

interface GameImageProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallback?: string;
  type?: 'item' | 'monster' | 'skill' | 'job' | 'map' | 'attribute';
  priority?: boolean;
}

export default function GameImage({
  src,
  alt,
  width = 64,
  height = 64,
  className = '',
  // fallback,
  type = 'item',
  priority = false
}: GameImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // URL 경로 수정 함수 (icon -> icons)
  const fixIconUrl = (url?: string): string | undefined => {
    if (!url) return url;

    // https://r2.gihyeonofsoul.com/icon/ -> https://r2.gihyeonofsoul.com/icons/
    const fixedUrl = url.replace('/icon/', '/icons/');

    // 디버깅용 로그 (URL이 변경된 경우만)
    if (fixedUrl !== url) {
      console.log(`🔧 URL 수정: ${url} → ${fixedUrl}`);
    }

    return fixedUrl;
  };

  // 수정된 URL
  const fixedSrc = fixIconUrl(src);

  // src가 변경되면 상태 리셋
  useEffect(() => {
    if (fixedSrc) {
      setImageError(false);
      setIsImageLoaded(false);
    }
  }, [fixedSrc]);

  // 타입별 기본 아이콘 설정
  const getDefaultIcon = () => {
    switch (type) {
      case 'map':
        return '🗺️';
      case 'monster':
        return '👹';
      case 'skill':
        return '⚡';
      case 'job':
        return '👤';
      case 'attribute':
        return '💎';
      case 'item':
      default:
        return '📦';
    }
  };

  const handleImageError = () => {
    console.warn(`이미지 로드 실패: ${fixedSrc} (원본: ${src})`);
    setImageError(true);
    setIsImageLoaded(false);
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
    setImageError(false);
  };

  // URL 유효성 검사
  const isValidImageUrl = (url?: string): boolean => {
    if (!url) return false;
    try {
      new URL(url);
      return url.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i) !== null;
    } catch {
      return false;
    }
  };

  // 이미지를 보여줄 수 없는 경우들
  const shouldShowFallback = !fixedSrc || !isValidImageUrl(fixedSrc) || imageError;

  if (shouldShowFallback) {
    return (
      <div
        className={`relative overflow-hidden rounded-lg bg-gray-800/50 flex items-center justify-center border border-gray-700/50 ${className}`}
        style={{ width, height }}
        title={`${alt} (이미지 없음)`}
      >
        <span className="text-gray-400 text-2xl select-none">{getDefaultIcon()}</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <Image
        src={fixedSrc}
        alt={alt}
        width={width}
        height={height}
        className={`object-cover transition-opacity duration-200 ${isImageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        unoptimized={true} // 최적화 비활성화로 속도 개선
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        style={{
          objectFit: 'cover',
          // backgroundColor: '#f3f4f6' // Removed to fix white corners
        }}
      />

      {/* 이미지가 로드되지 않았을 때 보여줄 백그라운드 */}
      {!isImageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-800/50 flex items-center justify-center">
          <span className="text-gray-400 text-lg animate-pulse">{getDefaultIcon()}</span>
        </div>
      )}
    </div>
  );
}
