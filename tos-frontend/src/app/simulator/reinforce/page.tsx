"use client";

import { useState, useMemo } from "react";
import {
    REINFORCE_DATA_BY_LEVEL,
    EQUIPMENT_LEVELS,
    REINFORCE_PARAMS,
    ReinforceData
} from "./data";
import { Hammer, TrendingUp, AlertCircle, Play, BarChart3 } from "lucide-react";

interface SimulationResult {
    attempts: number;
    successes: number;
    failures: number;
    totalCost: number;
    failRevisionUsed: number;
}

export default function ReinforcePage() {
    const [equipLevel, setEquipLevel] = useState(540);
    const [currentReinforce, setCurrentReinforce] = useState(0);
    const [targetReinforce, setTargetReinforce] = useState(10);
    const [useSubRevision, setUseSubRevision] = useState(0);
    const [usePremiumSubRevision, setUsePremiumSubRevision] = useState(0);
    const [simulationCount, setSimulationCount] = useState(1000);
    const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);

    const reinforceData = useMemo(() =>
        REINFORCE_DATA_BY_LEVEL[equipLevel] || [],
        [equipLevel]
    );

    // 확률 계산 함수
    const calculateProbability = (
        data: ReinforceData,
        failRevision: number,
        subCount: number,
        premiumSubCount: number
    ) => {
        const base = data.basicProp;

        // 실패 보정 추가
        let total = base + failRevision;

        // 일반 보조제 추가
        const subRevision = Math.ceil(base * REINFORCE_PARAMS.SUB_REVISION_RATIO);
        total += subRevision * Math.min(subCount, REINFORCE_PARAMS.MAX_SUB_REVISION_COUNT);

        // 프리미엄 보조제 추가
        const premiumSubRevision = Math.ceil(base * REINFORCE_PARAMS.PREMIUM_SUB_REVISION_RATIO);
        total += premiumSubRevision * Math.min(premiumSubCount, REINFORCE_PARAMS.MAX_PREMIUM_SUB_REVISION_COUNT);

        return Math.min(total, 100000);
    };

    // 시뮬레이션 실행
    const runSimulation = () => {
        setIsSimulating(true);

        setTimeout(() => {
            let totalAttempts = 0;
            let totalSuccesses = 0;
            let totalFailures = 0;

            for (let sim = 0; sim < simulationCount; sim++) {
                let currentLevel = currentReinforce;
                let failRevision = 0;

                while (currentLevel < targetReinforce) {
                    const targetLevel = currentLevel + 1;
                    const data = reinforceData.find(d => d.level === targetLevel);
                    if (!data) break;

                    const probability = calculateProbability(
                        data,
                        failRevision,
                        useSubRevision,
                        usePremiumSubRevision
                    );

                    const roll = Math.random() * 100000;
                    totalAttempts++;

                    if (roll < probability) {
                        // 성공
                        currentLevel++;
                        failRevision = 0;
                        totalSuccesses++;
                    } else {
                        // 실패
                        const failAdd = Math.ceil(probability * REINFORCE_PARAMS.REINFORCE_FAIL_REVISION_RATIO);
                        failRevision = Math.min(failRevision + failAdd, REINFORCE_PARAMS.MAX_FAIL_REVISION);
                        totalFailures++;
                    }
                }
            }

            setSimulationResult({
                attempts: totalAttempts,
                successes: totalSuccesses,
                failures: totalFailures,
                totalCost: 0, // TODO: 재료 비용 계산
                failRevisionUsed: 0
            });
            setIsSimulating(false);
        }, 100);
    };

    // 확률표 생성
    const probabilityTable = useMemo(() => {
        return reinforceData.map(data => {
            const baseProb = data.basicProp / 1000;
            const withSub = calculateProbability(data, 0, useSubRevision, 0) / 1000;
            const withPremium = calculateProbability(data, 0, 0, usePremiumSubRevision) / 1000;
            const withBoth = calculateProbability(data, 0, useSubRevision, usePremiumSubRevision) / 1000;

            return {
                level: data.level,
                baseProb,
                withSub,
                withPremium,
                withBoth,
                addAtk: data.addAtk,
                addDef: data.addDef
            };
        });
    }, [reinforceData, useSubRevision, usePremiumSubRevision]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">장비 강화 시뮬레이터</h1>
                <p className="mt-1 text-sm text-gray-500">
                    여신 장비 강화 확률 및 예상 비용을 시뮬레이션합니다
                </p>
            </div>

            {/* Settings Panel */}
            <div className="bg-white shadow rounded-lg p-6 space-y-6">
                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Hammer className="w-5 h-5 text-indigo-500" />
                    강화 설정
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Equipment Level */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">장비 레벨</label>
                        <select
                            value={equipLevel}
                            onChange={(e) => setEquipLevel(Number(e.target.value))}
                            className="block w-full pl-3 pr-10 py-2 text-base text-gray-900 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            {EQUIPMENT_LEVELS.map(lv => (
                                <option key={lv} value={lv}>{lv} 레벨</option>
                            ))}
                        </select>
                    </div>

                    {/* Current Reinforce */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">현재 강화</label>
                        <input
                            type="number"
                            min={0}
                            max={29}
                            value={currentReinforce}
                            onChange={(e) => setCurrentReinforce(Math.min(29, Math.max(0, Number(e.target.value))))}
                            className="block w-full pl-3 pr-3 py-2 text-base text-gray-900 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        />
                    </div>

                    {/* Target Reinforce */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">목표 강화</label>
                        <input
                            type="number"
                            min={1}
                            max={30}
                            value={targetReinforce}
                            onChange={(e) => setTargetReinforce(Math.min(30, Math.max(1, Number(e.target.value))))}
                            className="block w-full pl-3 pr-3 py-2 text-base text-gray-900 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        />
                    </div>

                    {/* Simulation Count */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">시뮬레이션 횟수</label>
                        <select
                            value={simulationCount}
                            onChange={(e) => setSimulationCount(Number(e.target.value))}
                            className="block w-full pl-3 pr-10 py-2 text-base text-gray-900 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option value={100}>100회</option>
                            <option value={1000}>1,000회</option>
                            <option value={10000}>10,000회</option>
                        </select>
                    </div>
                </div>

                {/* Sub Revision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            일반 강화 보조제 ({REINFORCE_PARAMS.MAX_SUB_REVISION_COUNT}개 까지)
                        </label>
                        <input
                            type="range"
                            min={0}
                            max={REINFORCE_PARAMS.MAX_SUB_REVISION_COUNT}
                            value={useSubRevision}
                            onChange={(e) => setUseSubRevision(Number(e.target.value))}
                            className="w-full"
                        />
                        <div className="text-sm text-gray-500 mt-1">{useSubRevision}개 사용</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            프리미엄 강화 보조제 ({REINFORCE_PARAMS.MAX_PREMIUM_SUB_REVISION_COUNT}개 까지)
                        </label>
                        <input
                            type="range"
                            min={0}
                            max={REINFORCE_PARAMS.MAX_PREMIUM_SUB_REVISION_COUNT}
                            value={usePremiumSubRevision}
                            onChange={(e) => setUsePremiumSubRevision(Number(e.target.value))}
                            className="w-full"
                        />
                        <div className="text-sm text-gray-500 mt-1">{usePremiumSubRevision}개 사용</div>
                    </div>
                </div>

                {/* Run Button */}
                <button
                    onClick={runSimulation}
                    disabled={isSimulating || currentReinforce >= targetReinforce}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Play className="w-4 h-4" />
                    {isSimulating ? '시뮬레이션 중...' : '시뮬레이션 실행'}
                </button>
            </div>

            {/* Simulation Result */}
            {simulationResult && (
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        시뮬레이션 결과 ({simulationCount.toLocaleString()}회 평균)
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-indigo-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-indigo-600">
                                {(simulationResult.attempts / simulationCount).toFixed(1)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">평균 시도 횟수</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {(simulationResult.successes / simulationCount).toFixed(1)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">평균 성공 횟수</div>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-red-600">
                                {(simulationResult.failures / simulationCount).toFixed(1)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">평균 실패 횟수</div>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-yellow-600">
                                {((simulationResult.successes / simulationResult.attempts) * 100).toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-500 mt-1">실제 성공률</div>
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-gray-600">
                                <strong>{currentReinforce}강 → {targetReinforce}강</strong>까지
                                평균 <strong>{(simulationResult.attempts / simulationCount).toFixed(1)}회</strong> 시도가 필요합니다.
                                (실패 보정 시스템 적용 시뮬레이션)
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Probability Table */}
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-indigo-500" />
                    강화 확률표 ({equipLevel} 레벨 장비)
                </h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">강화</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">기본 확률</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">+보조제</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">+프리미엄</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">최종 확률</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">공격력</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">방어력</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {probabilityTable.map((row) => {
                                const isTarget = row.level > currentReinforce && row.level <= targetReinforce;
                                return (
                                    <tr key={row.level} className={isTarget ? 'bg-indigo-50' : ''}>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {row.level}강
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                            {row.baseProb.toFixed(2)}%
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                            {row.withSub.toFixed(2)}%
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                            {row.withPremium.toFixed(2)}%
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-indigo-600">
                                            {row.withBoth.toFixed(2)}%
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                            +{row.addAtk.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                            +{row.addDef.toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
