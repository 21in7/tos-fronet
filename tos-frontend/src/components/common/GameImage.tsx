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
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  fill?: boolean;
}

export default function GameImage({
  src,
  alt,
  width = 64,
  height = 64,
  className = '',
  // fallback,
  type = 'item',
  priority = false,
  objectFit = 'cover',
  fill = false
}: GameImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // ... (keeping existing logic for R2_BASE_URL, fixIconUrl, etc.)

  // R2 스토리지 기본 URL
  const R2_BASE_URL = 'https://r2.gihyeonofsoul.com/icons';

  // URL 경로 수정 함수 (icon -> icons, 또는 아이콘 이름을 전체 URL로 변환)
  const fixIconUrl = (url?: string): string | undefined => {
    if (!url) return url;

    // 이미 전체 URL인 경우 (http:// 또는 https://로 시작)
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // https://r2.gihyeonofsoul.com/icon/ -> https://r2.gihyeonofsoul.com/icons/
      const fixedUrl = url.replace('/icon/', '/icons/');

      // 디버깅용 로그 (URL이 변경된 경우만)
      if (fixedUrl !== url) {
        console.log(`🔧 URL 수정: ${url} → ${fixedUrl}`);
      }

      return fixedUrl;
    }

    // 아이콘 이름만 있는 경우 (예: "icon_scout_blooderuption", "c_scout_grimmark")
    // 전체 URL로 변환
    const iconName = url.trim();

    // 이미 확장자가 있는 경우
    if (iconName.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) {
      return `${R2_BASE_URL}/${iconName}`;
    }

    // 확장자가 없는 경우 .png 추가
    return `${R2_BASE_URL}/${iconName}.png`;
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

  // URL 유효성 검사 (아이콘 이름도 유효하다고 판단)
  const isValidImageUrl = (url?: string): boolean => {
    if (!url) return false;

    // 이미 전체 URL인 경우
    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        new URL(url);
        return url.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i) !== null;
      } catch {
        return false;
      }
    }

    // 아이콘 이름인 경우 (icon_, c_ 등으로 시작하거나 알파벳/숫자/_로 구성)
    // fixIconUrl에서 전체 URL로 변환될 것이므로 유효하다고 판단
    return /^[a-zA-Z0-9_-]+$/.test(url.trim());
  };

  // 이미지를 보여줄 수 없는 경우들
  const shouldShowFallback = !fixedSrc || !isValidImageUrl(fixedSrc) || imageError;

  if (shouldShowFallback) {
    const fallbackStyle: React.CSSProperties = fill ? { width: '100%', height: '100%' } : { width, height };

    return (
      <div
        className={`relative overflow-hidden rounded-lg bg-gray-800/50 flex items-center justify-center border border-gray-700/50 ${className}`}
        style={fallbackStyle}
        title={`${alt} (이미지 없음)`}
      >
        <span className="text-gray-400 text-2xl select-none">{getDefaultIcon()}</span>
      </div>
    );
  }

  // Next.js Image component props construction
  const imageProps: any = {
    src: fixedSrc,
    alt: alt,
    className: `transition-opacity duration-200 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`,
    onError: handleImageError,
    onLoad: handleImageLoad,
    unoptimized: true,
    priority: priority,
    loading: priority ? 'eager' : 'lazy',
    style: {
      objectFit: objectFit,
    }
  };

  if (fill) {
    imageProps.fill = true;
    imageProps.sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"; // Default sizes
  } else {
    imageProps.width = width;
    imageProps.height = height;
  }

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`} style={fill ? { width: '100%', height: '100%' } : {}}>
      <Image
        {...imageProps}
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
