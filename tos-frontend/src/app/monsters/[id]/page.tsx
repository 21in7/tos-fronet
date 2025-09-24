'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { monstersApi } from '@/lib/api';
import { Monster } from '@/types/api';
import GameImage from '@/components/common/GameImage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { ArrowLeft, Skull, Heart, Shield, Zap, Target, Sword } from 'lucide-react';

export default function MonsterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const monsterIds = params.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ['monster', monsterIds],
    queryFn: () => monstersApi.getById(monsterIds),
    enabled: !!monsterIds,
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
          몬스터 정보를 불러올 수 없습니다
        </div>
        <div className="text-gray-600 mb-4">
          {error.message || '다시 시도해주세요.'}
        </div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          돌아가기
        </button>
      </div>
    );
  }

  const monster = data?.data as Monster;

  if (!monster) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">몬스터를 찾을 수 없습니다</div>
        <button
          onClick={() => router.back()}
          className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            몬스터 목록으로
          </button>
        </div>

        {/* 메인 정보 */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-start space-x-6">
              {/* 몬스터 이미지 */}
              <div className="flex-shrink-0">
                <GameImage
                  src={monster.icon_url}
                  alt={monster.name}
                  width={128}
                  height={128}
                  type="monster"
                  className="border-2 border-gray-200"
                  priority={true} // 상세 페이지 메인 이미지는 우선 로딩
                />
              </div>

              {/* 기본 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{monster.name}</h1>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                    <Skull className="w-4 h-4 mr-1" />
                    몬스터
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">레벨:</span>
                    <span className="font-semibold text-gray-900">{monster.level}</span>
                  </div>

                  {monster.race && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">종족:</span>
                      <span className="font-semibold text-gray-900">{monster.race}</span>
                    </div>
                  )}

                  {monster.rank && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">등급:</span>
                      <span className="font-semibold text-gray-900">{monster.rank}</span>
                    </div>
                  )}

                  {monster.size && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">크기:</span>
                      <span className="font-semibold text-gray-900">{monster.size}</span>
                    </div>
                  )}

                  {monster.element && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">속성:</span>
                      <span className="font-semibold text-gray-900">{monster.element}</span>
                    </div>
                  )}
                </div>

                {/* 설명 */}
                {(monster.descriptions || monster.description) && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">설명</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {monster.descriptions || monster.description || '설명이 없습니다.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 스탯 정보 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 기본 스탯 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Heart className="w-5 h-5 text-red-500 mr-2" />
              기본 스탯
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">HP</span>
                <span className="text-sm font-semibold text-gray-900">{monster.hp?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">경험치</span>
                <span className="text-sm font-semibold text-gray-900">{monster.exp?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">클래스 경험치</span>
                <span className="text-sm font-semibold text-gray-900">{monster.exp_class?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>

          {/* 공격 스탯 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Sword className="w-5 h-5 text-red-500 mr-2" />
              공격 스탯
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">물리 공격력</span>
                <span className="text-sm font-semibold text-gray-900">
                  {monster.patk_min} - {monster.patk_max}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">마법 공격력</span>
                <span className="text-sm font-semibold text-gray-900">
                  {monster.matk_min} - {monster.matk_max}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">명중률</span>
                <span className="text-sm font-semibold text-gray-900">{monster.accuracy || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">치명타율</span>
                <span className="text-sm font-semibold text-gray-900">{monster.critrate || 0}</span>
              </div>
            </div>
          </div>

          {/* 방어 스탯 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 text-blue-500 mr-2" />
              방어 스탯
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">물리 방어력</span>
                <span className="text-sm font-semibold text-gray-900">{monster.pdef || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">마법 방어력</span>
                <span className="text-sm font-semibold text-gray-900">{monster.mdef || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">회피율</span>
                <span className="text-sm font-semibold text-gray-900">{monster.eva || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">블록률</span>
                <span className="text-sm font-semibold text-gray-900">{monster.block || 0}</span>
              </div>
            </div>
          </div>

          {/* 능력치 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">능력치</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">STR</span>
                <span className="text-sm font-semibold text-gray-900">{monster.stat_str || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">CON</span>
                <span className="text-sm font-semibold text-gray-900">{monster.stat_con || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">INT</span>
                <span className="text-sm font-semibold text-gray-900">{monster.stat_int || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">SPR</span>
                <span className="text-sm font-semibold text-gray-900">{monster.stat_spr || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">DEX</span>
                <span className="text-sm font-semibold text-gray-900">{monster.stat_dex || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 메타 정보 */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">상세 정보</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">ID:</span>
              <span className="ml-2 font-mono">{monster.id}</span>
            </div>
            <div>
              <span className="text-gray-600">생성일:</span>
              <span className="ml-2">
                {new Date(monster.created || monster.created_at || '').toLocaleDateString('ko-KR')}
              </span>
            </div>
            <div>
              <span className="text-gray-600">수정일:</span>
              <span className="ml-2">
                {new Date(monster.updated || monster.updated_at || '').toLocaleDateString('ko-KR')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
