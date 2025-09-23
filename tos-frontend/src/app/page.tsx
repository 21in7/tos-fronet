'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';
import { DashboardStats } from '@/types/api';
import StatsCard from '@/components/dashboard/StatsCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { 
  BarChart3, 
  Sword, 
  Skull, 
  Zap, 
  Briefcase, 
  Map,
  Shield,
  Trophy
} from 'lucide-react';

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardApi.getStats(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-semibold mb-2">
          데이터를 불러올 수 없습니다
        </div>
        <div className="text-gray-600 mb-4">
          {error.message || 'API 서버가 실행 중인지 확인해주세요.'}
        </div>
        <div className="text-sm text-gray-500">
          데이터베이스 테이블이 생성되지 않았을 수 있습니다.
        </div>
      </div>
    );
  }

  const stats = data?.data as DashboardStats;

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="mt-1 text-sm text-gray-500">
            Tavern of Soul 게임 데이터 현황을 확인하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="총 특성 수"
            value={stats?.attributes || 0}
            icon={BarChart3}
            color="blue"
          />
          <StatsCard
            title="총 아이템 수"
            value={stats?.items || 0}
            icon={Sword}
            color="green"
          />
          <StatsCard
            title="총 몬스터 수"
            value={stats?.monsters || 0}
            icon={Skull}
            color="red"
          />
          <StatsCard
            title="총 스킬 수"
            value={stats?.skills || 0}
            icon={Zap}
            color="yellow"
          />
          <StatsCard
            title="총 직업 수"
            value={stats?.jobs || 0}
            icon={Briefcase}
            color="purple"
          />
          <StatsCard
            title="총 맵 수"
            value={stats?.maps || 0}
            icon={Map}
            color="blue"
          />
          <StatsCard
            title="총 버프 수"
            value={stats?.buffs || 0}
            icon={Shield}
            color="green"
          />
          <StatsCard
            title="총 업적 수"
            value={stats?.achievements || 0}
            icon={Trophy}
            color="yellow"
          />
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            최근 활동
          </h2>
          <div className="text-gray-500 text-sm">
            최근 추가된 데이터가 여기에 표시됩니다.
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}