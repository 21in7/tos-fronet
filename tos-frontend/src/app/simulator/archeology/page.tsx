"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import { EXHIBITION_ITEMS, OPTION_DATA, OptionData, ExhibitionItem } from "./data";
import { calcWeightBaseRandom, isInteger } from "./utils";
import { RefreshCw, Play, Square, Award, Settings, Info, Search, List } from "lucide-react";

interface EnchantResult {
    id: number;
    value: number;
    option: OptionData;
}

interface Stats {
    totalRolls: number;
    optionCounts: Record<number, number>;
    optionValueSum: Record<number, number>;
    optionValueCount: Record<number, number>;
}

interface ItemWithOption {
    item: ExhibitionItem;
    options: OptionData[];
}

export default function ArcheologyPage() {
    const [selectedItemId, setSelectedItemId] = useState<string>("");
    const [selectedOptionDescs, setSelectedOptionDescs] = useState<string[]>(["", "", ""]);
    const [results, setResults] = useState<EnchantResult[] | null>(null);
    const [stats, setStats] = useState<Stats>({
        totalRolls: 0,
        optionCounts: {},
        optionValueSum: {},
        optionValueCount: {},
    });

    const [isAutoEnchanting, setIsAutoEnchanting] = useState(false);
    const [autoEnchantCount, setAutoEnchantCount] = useState(0);

    // 전체 옵션 목록 (중복 제거)
    const allOptionDescs = useMemo(() => {
        const descs = new Set(OPTION_DATA.filter(opt => opt.Weight > 0).map(opt => opt.Desc));
        return Array.from(descs).sort();
    }, []);

    const currentItem = useMemo(() =>
        EXHIBITION_ITEMS.find(item => item.ClassID.toString() === selectedItemId),
        [selectedItemId]
    );

    const currentOptionPool = useMemo(() => {
        if (!currentItem) {
            return OPTION_DATA.filter(opt => opt.Weight > 0);
        }
        const optionIds = currentItem.OptionPool.split(';').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
        return OPTION_DATA.filter(opt => optionIds.includes(opt.ClassID) && opt.Weight > 0);
    }, [currentItem]);

    const availableDescs = useMemo(() => {
        if (!currentItem) {
            // 아이템 미선택 시 전체 옵션 표시
            return allOptionDescs;
        }
        const descs = new Set(currentOptionPool.map(opt => opt.Desc));
        return Array.from(descs).sort();
    }, [currentItem, currentOptionPool, allOptionDescs]);

    // 선택한 옵션이 등장하는 아이템 목록
    const itemsWithSelectedOption = useMemo(() => {
        const activeDescs = selectedOptionDescs.filter(d => d !== "");
        if (activeDescs.length === 0) return [];

        const result: ItemWithOption[] = [];

        for (const item of EXHIBITION_ITEMS) {
            const optionIds = item.OptionPool.split(';').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
            const itemOptions = OPTION_DATA.filter(opt => optionIds.includes(opt.ClassID) && opt.Weight > 0);

            // 선택된 옵션 중 하나라도 포함하는지 확인
            const matchingOptions = itemOptions.filter(opt => activeDescs.includes(opt.Desc));

            if (matchingOptions.length > 0) {
                result.push({
                    item,
                    options: matchingOptions
                });
            }
        }

        return result;
    }, [selectedOptionDescs]);

    // Probability calculation
    const probabilityInfo = useMemo(() => {
        if (!currentItem) return null;

        const activeDescs = selectedOptionDescs.filter(d => d !== "");
        if (activeDescs.length === 0) return null;

        const totalWeight = currentOptionPool.reduce((sum, opt) => sum + opt.Weight, 0);
        const descWeights: Record<string, number> = {};

        activeDescs.forEach(desc => {
            const options = currentOptionPool.filter(opt => opt.Desc === desc);
            descWeights[desc] = options.reduce((sum, opt) => sum + opt.Weight, 0);
        });

        const totalSelectedWeight = Object.values(descWeights).reduce((sum, w) => sum + w, 0);
        const optionCount = currentItem.OptionCount;

        const failProb = Math.pow((totalWeight - totalSelectedWeight) / totalWeight, optionCount);
        const atLeastOneMatchProb = (1 - failProb) * 100;

        let allMatchProb = 0;
        if (activeDescs.length > 0 && activeDescs.length <= 3) {
            const individualProbs = activeDescs.map(desc => descWeights[desc] / totalWeight);

            if (activeDescs.length === 1) {
                allMatchProb = atLeastOneMatchProb;
            } else if (activeDescs.length === 2 && optionCount >= 2) {
                const p1 = individualProbs[0];
                const p2 = individualProbs[1];
                const combinations = (optionCount * (optionCount - 1)) / 2;
                allMatchProb = combinations * p1 * p2 * Math.pow(1 - p1 - p2, Math.max(0, optionCount - 2)) * 100;
            } else if (activeDescs.length === 3 && optionCount >= 3) {
                const p1 = individualProbs[0];
                const p2 = individualProbs[1];
                const p3 = individualProbs[2];
                allMatchProb = 6 * p1 * p2 * p3 * Math.pow(1 - p1 - p2 - p3, Math.max(0, optionCount - 3)) * 100;
            }
        }

        const descDetails = activeDescs.map(desc => {
            const weight = descWeights[desc];
            const percentage = (weight / totalWeight) * 100;
            const options = currentOptionPool.filter(opt => opt.Desc === desc);
            const minValues = options.map(opt => opt.MinValue);
            const maxValues = options.map(opt => opt.MaxValue);
            const overallMin = Math.min(...minValues);
            const overallMax = Math.max(...maxValues);

            let maxGradeOption: OptionData | null = null;
            let maxGradeWeight = 0;
            for (const opt of options) {
                if (opt.MaxValue === overallMax) {
                    if (!maxGradeOption || opt.Weight > maxGradeWeight) {
                        maxGradeOption = opt;
                        maxGradeWeight = opt.Weight;
                    }
                }
            }

            const optionAppearProb = weight / totalWeight;
            const maxGradeProb = maxGradeOption ? (maxGradeWeight / weight) : 0;
            let maxValueProb = 0;
            if (maxGradeOption) {
                const minVal = maxGradeOption.MinValue;
                const maxVal = maxGradeOption.MaxValue;
                if (isInteger(minVal) && isInteger(maxVal)) {
                    maxValueProb = 1 / (maxVal - minVal + 1);
                } else {
                    maxValueProb = 1 / (maxVal - minVal);
                }
            }
            const maxValueFinalProb = optionCount * optionAppearProb * maxGradeProb * maxValueProb * 100;

            const grades = {
                Low: options.filter(o => o.Grade === 1),
                Mid: options.filter(o => o.Grade === 2),
                High: options.filter(o => o.Grade === 3),
            };

            return {
                desc,
                weight,
                percentage,
                overallMin,
                overallMax,
                isEffect: options[0]?.Type === 'Effect',
                maxValueFinalProb,
                grades,
            };
        });

        return {
            atLeastOneMatchProb,
            allMatchProb,
            descDetails,
            optionCount
        };
    }, [currentItem, currentOptionPool, selectedOptionDescs]);

    const handleRoll = useCallback(() => {
        if (!currentItem) return;

        const validPool = currentOptionPool.map(opt => ({
            ...opt,
            weight: opt.Weight
        }));

        if (validPool.length === 0) {
            return;
        }

        const rollResults = calcWeightBaseRandom(validPool, currentItem.OptionCount);
        const mappedResults: EnchantResult[] = rollResults.map(r => ({
            id: r.item.ClassID,
            value: r.value,
            option: r.item as unknown as OptionData
        }));

        setResults(mappedResults);

        setStats(prev => {
            const newStats = { ...prev };
            newStats.totalRolls++;
            mappedResults.forEach(r => {
                newStats.optionCounts[r.id] = (newStats.optionCounts[r.id] || 0) + 1;
                newStats.optionValueSum[r.id] = (newStats.optionValueSum[r.id] || 0) + r.value;
                newStats.optionValueCount[r.id] = (newStats.optionValueCount[r.id] || 0) + 1;
            });
            return newStats;
        });

        return mappedResults;
    }, [currentItem, currentOptionPool]);

    // Refs for auto enchant
    const stateRef = useRef({
        selectedOptionDescs,
        isAutoEnchanting,
        autoEnchantCount
    });

    useEffect(() => {
        stateRef.current = { selectedOptionDescs, isAutoEnchanting, autoEnchantCount };
    }, [selectedOptionDescs, isAutoEnchanting, autoEnchantCount]);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const runAutoEnchant = () => {
            if (!stateRef.current.isAutoEnchanting) return;

            const activeDescs = stateRef.current.selectedOptionDescs.filter(d => d !== "");
            if (activeDescs.length === 0) {
                setIsAutoEnchanting(false);
                return;
            }

            const result = handleRoll();
            setAutoEnchantCount(c => c + 1);

            if (result) {
                const resultDescs = new Set(result.map(r => r.option.Desc));
                const allFound = activeDescs.every(d => resultDescs.has(d));

                if (allFound) {
                    setIsAutoEnchanting(false);
                    setTimeout(() => {
                        alert(`성공! ${stateRef.current.autoEnchantCount + 1}회 만에 원하는 옵션을 찾았습니다!`);
                    }, 100);
                    return;
                }
            }

            timeoutId = setTimeout(runAutoEnchant, 50);
        };

        if (isAutoEnchanting) {
            runAutoEnchant();
        }

        return () => {
            clearTimeout(timeoutId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAutoEnchanting]);

    const toggleAutoEnchant = () => {
        if (!isAutoEnchanting) {
            setAutoEnchantCount(0);
            setIsAutoEnchanting(true);
        } else {
            setIsAutoEnchanting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">고고학 옵션 시뮬레이터</h1>
                <p className="mt-1 text-sm text-gray-500">
                    인게임과 동일한 Weight 기반 랜덤 알고리즘으로 옵션을 뽑아보세요
                </p>
            </div>

            {/* Item Section */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg p-2 flex items-center justify-center">
                        <Image
                            src="/icon_item_crystal_purple.png"
                            alt="고고학 유물"
                            width={80}
                            height={80}
                            className="object-contain"
                        />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-lg font-medium text-gray-900">고고학 유물</h2>
                        <p className="text-sm text-gray-500 mt-1">감정하여 옵션을 부여할 수 있습니다</p>
                        <div className="flex flex-wrap gap-3 mt-4 justify-center sm:justify-start">
                            <button
                                onClick={() => handleRoll()}
                                disabled={!currentItem || isAutoEnchanting}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <RefreshCw className={`w-4 h-4 ${isAutoEnchanting ? "animate-spin" : ""}`} />
                                감정하기
                            </button>
                            <button
                                onClick={toggleAutoEnchant}
                                disabled={!currentItem}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${isAutoEnchanting
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {isAutoEnchanting ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                                {isAutoEnchanting ? '자동 감정 중지' : '자동 감정'}
                            </button>
                        </div>
                        {isAutoEnchanting && (
                            <div className="mt-3 text-sm text-yellow-700 bg-yellow-50 px-3 py-2 rounded-md inline-block">
                                자동 감정 진행 중... 시도 횟수: <span className="font-bold">{autoEnchantCount}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Control Panel */}
            <div className="bg-white shadow rounded-lg p-6 space-y-6">
                {/* Item Select */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Award className="w-4 h-4 text-indigo-500" /> 전시 아이템 선택
                    </label>
                    <select
                        value={selectedItemId}
                        onChange={(e) => {
                            setSelectedItemId(e.target.value);
                            setResults(null);
                        }}
                        className="block w-full pl-3 pr-10 py-2 text-base text-gray-900 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="">-- 아이템 선택 --</option>
                        {EXHIBITION_ITEMS.map((item) => (
                            <option key={item.ClassID} value={item.ClassID}>
                                {item.Name} (비용: {item.cost}, 옵션: {item.OptionCount}개)
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                        옵션을 선택하면 해당 옵션이 등장하는 아이템 목록이 표시됩니다
                    </p>
                </div>

                {/* Target Options */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Settings className="w-4 h-4 text-indigo-500" /> 원하는 옵션 선택 (최대 3개)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[0, 1, 2].map((idx) => (
                            <div key={idx}>
                                <label className="block text-xs text-gray-500 mb-1">옵션 {idx + 1}</label>
                                <select
                                    value={selectedOptionDescs[idx]}
                                    onChange={(e) => {
                                        const newDescs = [...selectedOptionDescs];
                                        newDescs[idx] = e.target.value;
                                        setSelectedOptionDescs(newDescs);
                                    }}
                                    className="block w-full pl-3 pr-10 py-2 text-base text-gray-900 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                    <option value="">-- 선택 안함 --</option>
                                    {availableDescs.map((desc) => (
                                        <option key={desc} value={desc}>{desc}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        원하는 옵션을 설명(Desc)으로 선택하세요. 최대 3개까지 선택 가능합니다.
                    </p>
                </div>

                {/* Items with Selected Option */}
                {itemsWithSelectedOption.length > 0 && (
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <List className="w-4 h-4 text-indigo-500" /> 선택한 옵션이 등장하는 아이템 목록
                        </label>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                            {/* Left - Option Info */}
                            <div className="bg-gray-50 rounded-md p-4">
                                {selectedOptionDescs.filter(d => d).map((desc, i) => {
                                    const options = OPTION_DATA.filter(opt => opt.Desc === desc && opt.Weight > 0);
                                    if (options.length === 0) return null;
                                    const minVal = Math.min(...options.map(o => o.MinValue));
                                    const maxVal = Math.max(...options.map(o => o.MaxValue));
                                    const isEffect = options[0]?.Type === 'Effect';

                                    return (
                                        <div key={i} className="mb-3 last:mb-0">
                                            <div className="font-medium text-gray-900">{desc}</div>
                                            <div className="text-sm text-gray-600">
                                                수치 범위: <span className="font-mono text-indigo-600">{minVal} ~ {maxVal}{isEffect && '%'}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Right - Items List */}
                            <div className="bg-indigo-50 rounded-md p-4 max-h-64 overflow-y-auto">
                                <div className="text-sm font-medium text-indigo-700 mb-2">
                                    등장 아이템: {itemsWithSelectedOption.length}개
                                </div>
                                <div className="space-y-2">
                                    {itemsWithSelectedOption.map(({ item, options }) => {
                                        const totalWeight = OPTION_DATA.filter(opt =>
                                            item.OptionPool.split(';').map(id => parseInt(id.trim())).includes(opt.ClassID) && opt.Weight > 0
                                        ).reduce((sum, opt) => sum + opt.Weight, 0);
                                        const optWeight = options.reduce((sum, opt) => sum + opt.Weight, 0);

                                        return (
                                            <div
                                                key={item.ClassID}
                                                className="bg-white p-2 rounded border border-indigo-100 cursor-pointer hover:border-indigo-300 transition-colors"
                                                onClick={() => setSelectedItemId(item.ClassID.toString())}
                                            >
                                                <div className="font-medium text-gray-900 text-sm">{item.Name}</div>
                                                <div className="text-xs text-gray-500">
                                                    수치 범위: {options[0]?.MinValue} ~ {options[0]?.MaxValue} |
                                                    옵션 {item.OptionCount}개 | 비용: {item.cost}
                                                </div>
                                                <div className="flex gap-2 mt-1">
                                                    {options.slice(0, 1).map((opt, i) => (
                                                        <span key={i} className={`text-xs px-1.5 py-0.5 rounded ${opt.Grade === 1 ? 'bg-green-100 text-green-700' :
                                                                opt.Grade === 2 ? 'bg-yellow-100 text-yellow-700' :
                                                                    'bg-red-100 text-red-700'
                                                            }`}>
                                                            {opt.Grade === 1 ? 'Low' : opt.Grade === 2 ? 'Mid' : 'High'}: {opt.MinValue}~{opt.MaxValue} (W:{opt.Weight})
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Probability Preview */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Info className="w-4 h-4 text-indigo-500" /> 확률 분석
                    </label>
                    <div className="bg-gray-50 rounded-md p-4">
                        {!currentItem ? (
                            <div className="text-center text-gray-500 text-sm py-4">아이템을 선택하면 확률이 표시됩니다</div>
                        ) : !probabilityInfo ? (
                            <div className="text-center text-gray-500 text-sm py-4">옵션을 선택하면 확률이 표시됩니다</div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-3 rounded-r-md">
                                    <div className="text-sm text-indigo-800 font-medium">최소 1개 이상 등장 확률</div>
                                    <div className="text-xl font-bold text-indigo-600">{probabilityInfo.atLeastOneMatchProb.toFixed(2)}%</div>
                                    {selectedOptionDescs.filter(d => d).length > 1 && (
                                        <div className="mt-2 pt-2 border-t border-indigo-100">
                                            <div className="text-sm text-green-800 font-medium">모두 등장 확률</div>
                                            <div className="text-xl font-bold text-green-600">{probabilityInfo.allMatchProb.toFixed(4)}%</div>
                                        </div>
                                    )}
                                </div>

                                {probabilityInfo.descDetails.map((detail, i) => (
                                    <div key={i} className="bg-white border border-gray-200 rounded-md p-3">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-medium text-gray-900">{detail.desc}</span>
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Weight: {detail.weight}</span>
                                        </div>
                                        <div className="text-sm text-gray-600 mb-2">
                                            수치 범위: <span className="font-mono font-bold text-indigo-600">{detail.overallMin} ~ {detail.overallMax}{detail.isEffect && '%'}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {Object.entries(detail.grades).map(([grade, opts]) =>
                                                opts.length > 0 && (
                                                    <span key={grade} className={`text-xs px-2 py-1 rounded-full border ${grade === 'Low' ? 'bg-green-50 border-green-200 text-green-700' :
                                                        grade === 'Mid' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                                                            'bg-red-50 border-red-200 text-red-700'
                                                        }`}>
                                                        {grade}: {opts[0].MinValue}~{opts[0].MaxValue}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                        <div className="text-xs text-yellow-700 bg-yellow-50 p-2 rounded">
                                            최대치({detail.overallMax}{detail.isEffect && '%'}) 등장 확률: <span className="font-bold">{detail.maxValueFinalProb.toFixed(4)}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Results Section */}
            {results && (
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-indigo-500" /> 감정 결과
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {results.map((res, idx) => {
                            const isMatch = selectedOptionDescs.includes(res.option.Desc);
                            const gradeColor = res.option.Grade === 1 ? 'text-green-600 bg-green-50 border-green-200' :
                                res.option.Grade === 2 ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
                                    'text-red-600 bg-red-50 border-red-200';

                            return (
                                <div key={idx} className={`relative p-4 rounded-lg border-2 ${isMatch ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}>
                                    {isMatch && <div className="absolute top-2 right-2 text-green-600 font-bold text-xs bg-white px-2 py-1 rounded-full shadow-sm">매칭</div>}
                                    <h3 className="font-medium text-gray-700 mb-2 min-h-[2.5rem] flex items-center">{res.option.Desc}</h3>
                                    <div className="text-2xl font-bold text-indigo-600 mb-2">
                                        {res.value}
                                        <span className="text-sm text-gray-400 ml-1">{res.option.Type === 'Effect' ? '%' : ''}</span>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${gradeColor}`}>
                                        {res.option.Grade === 1 ? 'Low' : res.option.Grade === 2 ? 'Mid' : 'High'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Stats Panel */}
            {stats.totalRolls > 0 && (
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Search className="w-5 h-5 text-indigo-500" /> 세션 통계
                    </h3>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-indigo-600">{stats.totalRolls}</div>
                            <div className="text-xs text-gray-500 mt-1">총 감정 횟수</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-purple-600">
                                {Object.values(stats.optionCounts).reduce((a, b) => a + b, 0)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">총 옵션 수</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-pink-600">{Object.keys(stats.optionCounts).length}</div>
                            <div className="text-xs text-gray-500 mt-1">고유 옵션 수</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {Object.entries(stats.optionCounts)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 10)
                            .map(([idStr, count]) => {
                                const id = parseInt(idStr);
                                const option = OPTION_DATA.find(o => o.ClassID === id);
                                if (!option) return null;

                                const totalOpts = Object.values(stats.optionCounts).reduce((a, b) => a + b, 0);
                                const percent = (count / totalOpts) * 100;

                                return (
                                    <div key={id} className="flex items-center gap-3 text-sm">
                                        <div className="w-1/3 truncate text-gray-700" title={option.Desc}>{option.Desc}</div>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                        <div className="w-10 text-right font-mono text-gray-500">{count}</div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            )}
        </div>
    );
}
