import Image from 'next/image';
import { useState } from 'react';
import { useImageCache } from '@/hooks/useImageCache';

interface GameImageProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallback?: string;
  type?: 'item' | 'monster' | 'skill' | 'job' | 'map';
}

export default function GameImage({ 
  src, 
  alt, 
  width = 64, 
  height = 64, 
  className = '',
  fallback = '/placeholder-item.png',
  type = 'item'
}: GameImageProps) {
  const [imageError, setImageError] = useState(false);
  const { cachedSrc, isLoading, error: cacheError } = useImageCache(src);
  
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
      case 'item':
      default:
        return '📦';
    }
  };

  const handleImageError = () => {
    console.log('이미지 로드 실패:', src);
    setImageError(true);
  };

  // src가 없거나 이미지 로드에 실패한 경우 기본 아이콘 표시
  if (!src || imageError || cacheError) {
    if (!src) {
      console.log('이미지 src 없음, 기본 아이콘 표시:', type);
    }
    return (
      <div className={`relative overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center ${className}`} style={{ width, height }}>
        <span className="text-gray-400 text-2xl">{getDefaultIcon()}</span>
      </div>
    );
  }

  // 로딩 중일 때 스켈레톤 표시
  if (isLoading) {
    return (
      <div className={`relative overflow-hidden rounded-lg bg-gray-200 animate-pulse ${className}`} style={{ width, height }}>
        <div className="w-full h-full bg-gray-300"></div>
      </div>
    );
  }


  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <Image
        src={cachedSrc || src}
        alt={alt}
        width={width}
        height={height}
        className="object-cover"
        unoptimized={true}
        onError={handleImageError}
        suppressHydrationWarning={true}
        priority={false}
        loading="lazy"
        // 캐싱 설정
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
    </div>
  );
}
