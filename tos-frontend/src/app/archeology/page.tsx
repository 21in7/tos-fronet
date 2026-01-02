"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { EXHIBITION_ITEMS, OPTION_DATA, ExhibitionItem, OptionData } from "./data";
import { calcWeightBaseRandom, isInteger } from "./utils";
import { Search, Info, Settings, RefreshCw, Play, Square, Award } from "lucide-react";

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

export default function ArcheologyPage() {
    const [selectedItemId, setSelectedItemId] = useState<string>("");
    const [selectedOptionDescs, setSelectedOptionDescs] = useState<string[]>(["", "", ""]);
    const [results, setResults] = useState<EnchantResult[] | null>(null);
    const [history, setHistory] = useState<EnchantResult[][]>([]);
    const [stats, setStats] = useState<Stats>({
        totalRolls: 0,
        optionCounts: {},
        optionValueSum: {},
        optionValueCount: {},
    });

    const [isAutoEnchanting, setIsAutoEnchanting] = useState(false);
    const [autoEnchantCount, setAutoEnchantCount] = useState(0);

    const currentItem = useMemo(() =>
        EXHIBITION_ITEMS.find(item => item.ClassID.toString() === selectedItemId),
        [selectedItemId]
    );

    const currentOptionPool = useMemo(() => {
        if (!currentItem) {
            // Return unique options if no item selected (just for initial view if needed)
            return OPTION_DATA.filter(opt => opt.Weight > 0);
        }
        const optionIds = currentItem.OptionPool.split(';').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
        return OPTION_DATA.filter(opt => optionIds.includes(opt.ClassID) && opt.Weight > 0);
    }, [currentItem]);

    const availableDescs = useMemo(() => {
        // Get unique descs from current pool
        const descs = new Set(currentOptionPool.map(opt => opt.Desc));
        return Array.from(descs).sort();
    }, [currentOptionPool]);

    // Derived state for probability calculation
    const probabilityInfo = useMemo(() => {
        if (!currentItem) return null;

        // Filter out empty selections
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

        // Probability that NONE of the selected options appear in N slots
        // P(fail) = ((Total - Selected) / Total) ^ N
        const failProb = Math.pow((totalWeight - totalSelectedWeight) / totalWeight, optionCount);
        const atLeastOneMatchProb = (1 - failProb) * 100;

        // Probability that ALL selected options appear
        let allMatchProb = 0;
        if (activeDescs.length > 0 && activeDescs.length <= 3) {
            const individualProbs = activeDescs.map(desc => descWeights[desc] / totalWeight);

            if (activeDescs.length === 1) {
                allMatchProb = atLeastOneMatchProb;
            } else if (activeDescs.length === 2 && optionCount >= 2) {
                const p1 = individualProbs[0];
                const p2 = individualProbs[1];
                // Approx: C(N, 2) * p1 * p2 * (1-p1-p2)^(N-2)
                const combinations = (optionCount * (optionCount - 1)) / 2;
                allMatchProb = combinations * p1 * p2 * Math.pow(1 - p1 - p2, Math.max(0, optionCount - 2)) * 100;
            } else if (activeDescs.length === 3 && optionCount >= 3) {
                const p1 = individualProbs[0];
                const p2 = individualProbs[1];
                const p3 = individualProbs[2];
                // Approx: 6 * p1 * p2 * p3 * (1-p1-p2-p3)^(N-3)
                allMatchProb = 6 * p1 * p2 * p3 * Math.pow(1 - p1 - p2 - p3, Math.max(0, optionCount - 3)) * 100;
            }
        }

        // Detailed stats for each selected desc
        const descDetails = activeDescs.map(desc => {
            const weight = descWeights[desc];
            const percentage = (weight / totalWeight) * 100;

            const options = currentOptionPool.filter(opt => opt.Desc === desc);
            const minValues = options.map(opt => opt.MinValue);
            const maxValues = options.map(opt => opt.MaxValue);
            const overallMin = Math.min(...minValues);
            const overallMax = Math.max(...maxValues);

            // Calculate max value probability
            // 1. Find max grade option
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
                    // float case, purely theoretical small probability, using 1/range
                    maxValueProb = 1 / (maxVal - minVal);
                }
            }

            // P(Max Value) ≈ N * P(Option) * P(Grade|Option) * P(Value|Grade)
            const maxValueFinalProb = optionCount * optionAppearProb * maxGradeProb * maxValueProb * 100;

            // Group by grade for display
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
                itemsWithThisOption: EXHIBITION_ITEMS.filter(item => {
                    const pool = item.OptionPool.split(';').map(id => parseInt(id.trim()));
                    return options.some(opt => pool.includes(opt.ClassID));
                }).map(item => {
                    const pool = item.OptionPool.split(';').map(id => parseInt(id.trim()));
                    return {
                        ...item,
                        // Find min/max for this specific item's version of this option
                        // (Actually options are global, so it's the same, but good for listing context)
                        options: OPTION_DATA.filter(o => o.Desc === desc && pool.includes(o.ClassID))
                    };
                })
            };
        });

        return {
            atLeastOneMatchProb,
            allMatchProb,
            descDetails,
            optionCount
        };

    }, [currentItem, currentOptionPool, selectedOptionDescs]);

    const handleRoll = () => {
        if (!currentItem) return;

        // Map OptionData to format expected by calcWeightBaseRandom ({ weight: number })
        // OptionData has Weight (uppercase), so we need to map it to lowercase weight.
        const validPool = currentOptionPool.map(opt => ({
            ...opt,
            weight: opt.Weight
        }));

        if (validPool.length === 0) {
            alert("No valid options found.");
            return;
        }

        const rollResults = calcWeightBaseRandom(validPool, currentItem.OptionCount);

        // Map back to full result structure (TS will see the extra 'weight' prop but it's fine, or we can destructure)
        const mappedResults: EnchantResult[] = rollResults.map(r => ({
            id: r.item.ClassID,
            value: r.value,
            option: r.item as unknown as OptionData // Cast back to OptionData
        }));

        setResults(mappedResults);
        setHistory(prev => [mappedResults, ...prev].slice(0, 50)); // Keep last 50

        // Update stats
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
    };

    // Use refs to access latest state inside timeout without trigger re-renders
    const stateRef = useRef({
        selectedOptionDescs,
        isAutoEnchanting,
        autoEnchantCount
    });

    // Update ref on render
    useEffect(() => {
        stateRef.current = { selectedOptionDescs, isAutoEnchanting, autoEnchantCount };
    }, [selectedOptionDescs, isAutoEnchanting, autoEnchantCount]);

    // Auto Enchant Effect
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

            // Increment count (functional update is safe)
            setAutoEnchantCount(c => c + 1);

            if (result) {
                const resultDescs = new Set(result.map(r => r.option.Desc));
                const allFound = activeDescs.every(d => resultDescs.has(d));

                if (allFound) {
                    setIsAutoEnchanting(false);
                    // Use setTimeout to allow UI to update before alert
                    setTimeout(() => {
                        alert(`Success! Found desired options in ${stateRef.current.autoEnchantCount + 1} attempts!`);
                    }, 100);
                    return; // Stop recursion
                }
            }

            // Schedule next run
            timeoutId = setTimeout(runAutoEnchant, 50);
        };

        if (isAutoEnchanting) {
            runAutoEnchant();
        }

        return () => {
            clearTimeout(timeoutId);
        };
        // Dependency array: only isAutoEnchanting toggle should trigger this effect start/stop
        // handleRoll is stable enough or we ignore it (it uses refs/state internally but returns result immediately)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAutoEnchanting]);


    // Reset auto count when starting
    const toggleAutoEnchant = () => {
        if (!isAutoEnchanting) {
            setAutoEnchantCount(0);
            setIsAutoEnchanting(true);
        } else {
            setIsAutoEnchanting(false);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Archeology Option Simulator</h1>
                    <p className="opacity-90 text-lg">Simulate in-game weight-based RNG logic</p>
                </div>

                <div className="p-6 md:p-10 space-y-8">

                    {/* Item Section */}
                    <div className="flex flex-col md:flex-row items-center gap-8 bg-gray-50 p-8 rounded-2xl shadow-inner border border-gray-100">
                        <div className="relative w-32 h-32 flex-shrink-0 bg-white p-4 rounded-xl shadow-md">
                            <Image
                                src="/icon_item_crystal_purple.png"
                                alt="Archeology Item"
                                width={100}
                                height={100}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Archeology Relic</h2>
                                <p className="text-gray-500">Identify to grant options</p>
                            </div>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                <button
                                    onClick={() => handleRoll()}
                                    disabled={!currentItem || isAutoEnchanting}
                                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:-translate-y-1 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    <RefreshCw className={isAutoEnchanting ? "animate-spin" : ""} />
                                    Identify
                                </button>
                                <button
                                    onClick={toggleAutoEnchant}
                                    disabled={!currentItem}
                                    className={`flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold transition-all ${isAutoEnchanting ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                                >
                                    {isAutoEnchanting ? <Square className="fill-current" /> : <Play className="fill-current" />}
                                    {isAutoEnchanting ? 'Stop Auto' : 'Auto Identify'}
                                </button>
                            </div>
                            {isAutoEnchanting && (
                                <div className="bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg inline-block border border-yellow-200">
                                    Auto-rolling... Attempts: <span className="font-bold">{autoEnchantCount}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Control Panel */}
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">

                        {/* Item Select */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 font-bold text-gray-700">
                                <Award className="w-5 h-5 text-indigo-500" /> Exhibition Item
                            </label>
                            <select
                                value={selectedItemId}
                                onChange={(e) => {
                                    setSelectedItemId(e.target.value);
                                    setSelectedOptionDescs(["", "", ""]); // Reset options on item change
                                    setResults(null);
                                }}
                                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors bg-white font-medium"
                            >
                                <option value="">-- Select Item --</option>
                                {EXHIBITION_ITEMS.map((item) => (
                                    <option key={item.ClassID} value={item.ClassID}>
                                        {item.Name} (Cost: {item.cost}, Options: {item.OptionCount})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Target Options */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 font-bold text-gray-700">
                                <Settings className="w-5 h-5 text-indigo-500" /> Target Options (Max 3)
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[0, 1, 2].map((idx) => (
                                    <div key={idx} className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-500">Option {idx + 1}</label>
                                        <select
                                            value={selectedOptionDescs[idx]}
                                            onChange={(e) => {
                                                const newDescs = [...selectedOptionDescs];
                                                newDescs[idx] = e.target.value;
                                                setSelectedOptionDescs(newDescs);
                                            }}
                                            disabled={!currentItem}
                                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none bg-white text-sm"
                                        >
                                            <option value="">-- None --</option>
                                            {availableDescs.map((desc) => (
                                                <option key={desc} value={desc}>{desc}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Probability Preview */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 font-bold text-gray-700">
                                <Info className="w-5 h-5 text-indigo-500" /> Probability Analysis
                            </label>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                {!currentItem ? (
                                    <div className="text-center text-gray-400 py-4">Select an item to see probabilities</div>
                                ) : !probabilityInfo ? (
                                    <div className="text-center text-gray-400 py-4">Select target options to see probabilities</div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Summary Stats */}
                                        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
                                            <div className="text-sm text-indigo-800 font-semibold mb-1">Chance for at least one match</div>
                                            <div className="text-2xl font-bold text-indigo-600">{probabilityInfo.atLeastOneMatchProb.toFixed(2)}%</div>

                                            {selectedOptionDescs.filter(d => d).length > 1 && (
                                                <div className="mt-3 pt-3 border-t border-indigo-100">
                                                    <div className="text-sm text-green-800 font-semibold mb-1">Chance for ALL matches</div>
                                                    <div className="text-2xl font-bold text-green-600">{probabilityInfo.allMatchProb.toFixed(4)}%</div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Detailed breakdown per option */}
                                        <div className="space-y-4">
                                            {probabilityInfo.descDetails.map((detail, i) => (
                                                <div key={i} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-bold text-gray-800">{detail.desc}</h4>
                                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Weight: {detail.weight}</span>
                                                    </div>
                                                    <div className="text-sm text-gray-600 mb-2">
                                                        Value Range: <span className="font-mono font-bold text-indigo-600">{detail.overallMin} ~ {detail.overallMax}{detail.isEffect && '%'}</span>
                                                    </div>

                                                    {/* Grades */}
                                                    <div className="flex flex-wrap gap-2 mb-3">
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

                                                    <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-lg text-sm text-yellow-800">
                                                        <div className="flex justify-between items-center">
                                                            <span>Start w/ Max Value Chance:</span>
                                                            <span className="font-bold text-lg">{detail.maxValueFinalProb.toFixed(4)}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Results Section */}
                    {results && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <Settings className="w-6 h-6 text-purple-600" /> Identification Results
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {results.map((res, idx) => {
                                    const isMatch = selectedOptionDescs.includes(res.option.Desc);
                                    const gradeColor = res.option.Grade === 1 ? 'text-green-600 bg-green-50 border-green-200' :
                                        res.option.Grade === 2 ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
                                            'text-red-600 bg-red-50 border-red-200';

                                    return (
                                        <div key={idx} className={`relative p-6 rounded-xl border-2 transition-all hover:shadow-lg ${isMatch ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}>
                                            {isMatch && <div className="absolute top-2 right-2 text-green-600 font-bold text-xs bg-white px-2 py-1 rounded-full shadow-sm">MATCH</div>}
                                            <h3 className="font-bold text-gray-700 mb-2 min-h-[3rem] items-center flex">{res.option.Desc}</h3>
                                            <div className="text-3xl font-black text-indigo-600 mb-3">
                                                {res.value}
                                                <span className="text-lg text-gray-400 ml-1">{res.option.Type === 'Effect' ? '%' : ''}</span>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${gradeColor}`}>
                                                {res.option.Grade === 1 ? 'Low' : res.option.Grade === 2 ? 'Mid' : 'High'} Grade
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Stats Panel */}
                    {stats.totalRolls > 0 && (
                        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Search className="w-5 h-5" /> Session Statistics
                            </h3>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-gray-800 p-4 rounded-xl text-center">
                                    <div className="text-3xl font-bold text-indigo-400">{stats.totalRolls}</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Total Rolls</div>
                                </div>
                                <div className="bg-gray-800 p-4 rounded-xl text-center">
                                    <div className="text-3xl font-bold text-purple-400">
                                        {Object.values(stats.optionCounts).reduce((a, b) => a + b, 0)}
                                    </div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Total Options</div>
                                </div>
                                <div className="bg-gray-800 p-4 rounded-xl text-center">
                                    <div className="text-3xl font-bold text-pink-400">{Object.keys(stats.optionCounts).length}</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Unique Options</div>
                                </div>
                            </div>

                            {/* Simple Bar Chart */}
                            <div className="space-y-3">
                                {Object.entries(stats.optionCounts)
                                    .sort(([, a], [, b]) => b - a) // Sort by count desc
                                    .slice(0, 10) // Top 10
                                    .map(([idStr, count]) => {
                                        const id = parseInt(idStr);
                                        const option = OPTION_DATA.find(o => o.ClassID === id);
                                        if (!option) return null;

                                        const totalOpts = Object.values(stats.optionCounts).reduce((a, b) => a + b, 0);
                                        const percent = (count / totalOpts) * 100;

                                        return (
                                            <div key={id} className="flex items-center gap-4 text-sm">
                                                <div className="w-1/3 truncate text-gray-300" title={option.Desc}>{option.Desc}</div>
                                                <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                                                        style={{ width: `${percent}%` }}
                                                    />
                                                </div>
                                                <div className="w-12 text-right font-mono text-gray-400">{count}</div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
