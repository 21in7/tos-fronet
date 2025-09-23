'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function ApiStatus() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['api-status'],
    queryFn: () => dashboardApi.getStatus(),
    retry: false,
    refetchInterval: 300000, // 5분마다 체크로 변경
    staleTime: 60000, // 1분간 캐시 유지
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 비활성화
    refetchOnMount: false, // 마운트 시 재요청 비활성화
  });

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-gray-500">
        <AlertCircle className="w-4 h-4 animate-pulse" />
        <span className="text-sm">API 연결 확인 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 text-red-600">
        <XCircle className="w-4 h-4" />
        <span className="text-sm">API 서버 연결 실패</span>
        <span className="text-xs text-gray-500">({error.message})</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-green-600">
      <CheckCircle className="w-4 h-4" />
      <span className="text-sm">API 서버 연결됨</span>
    </div>
  );
}
