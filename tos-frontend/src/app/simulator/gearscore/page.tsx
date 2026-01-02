"use client";

import { useState, useMemo } from "react";
import { calculateGearScore, EquipSlotType, GRADE_NAMES } from "./data";
import { Calculator, Plus, Trash2, BarChart3, Settings } from "lucide-react";

interface EquipItem {
    id: number;
    name: string;
    slotType: EquipSlotType;
    useLv: number;
    grade: number;
    reinforce: number;
    transcend: number;
    icorLv: number;
    randomOptionPortion: number;
    enchantPortion: number;
    gemPoint: number;
    // 아크 전용
    arkLv: number;
    arkHasOption1: boolean;
    arkHasOption2: boolean;
    isQuestArk: boolean;
    // 귀걸이 전용
    earringStatSum: number;
    earringGrade: number;
    // 벨트/어깨
    isHighOption: boolean;
}

const SLOT_TYPES: { value: EquipSlotType; label: string }[] = [
    { value: 'WEAPON', label: '무기' },
    { value: 'ARMOR', label: '방어구' },
    { value: 'ACCESSORY', label: '악세서리' },
    { value: 'SEAL', label: '인장' },
    { value: 'ARK', label: '아크' },
    { value: 'EARRING', label: '귀걸이' },
    { value: 'BELT', label: '벨트' },
    { value: 'SHOULDER', label: '어깨' },
];

const EQUIP_LEVELS = [460, 470, 480, 490, 500, 510, 520, 530, 540];

function createDefaultItem(id: number): EquipItem {
    return {
        id,
        name: `장비 ${id}`,
        slotType: 'WEAPON',
        useLv: 540,
        grade: 6,
        reinforce: 0,
        transcend: 10,
        icorLv: 540,
        randomOptionPortion: 1,
        enchantPortion: 1,
        gemPoint: 0,
        arkLv: 1,
        arkHasOption1: false,
        arkHasOption2: false,
        isQuestArk: false,
        earringStatSum: 0,
        earringGrade: 0,
        isHighOption: false,
    };
}

export default function GearScorePage() {
    const [items, setItems] = useState<EquipItem[]>([createDefaultItem(1)]);
    const [nextId, setNextId] = useState(2);

    const addItem = () => {
        setItems([...items, createDefaultItem(nextId)]);
        setNextId(nextId + 1);
    };

    const removeItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };

    const updateItem = (id: number, updates: Partial<EquipItem>) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, ...updates } : item
        ));
    };

    const itemScores = useMemo(() => {
        return items.map(item => ({
            id: item.id,
            score: calculateGearScore({
                slotType: item.slotType,
                useLv: item.useLv,
                grade: item.grade,
                reinforce: item.reinforce,
                transcend: item.transcend,
                icorLv: item.icorLv,
                randomIcorLv: 0,
                randomOptionPortion: item.randomOptionPortion,
                enchantPortion: item.enchantPortion,
                gemPoint: item.gemPoint,
                isHighOption: item.isHighOption,
                arkLv: item.arkLv,
                arkHasOption1: item.arkHasOption1,
                arkHasOption2: item.arkHasOption2,
                isQuestArk: item.isQuestArk,
                earringStatSum: item.earringStatSum,
                earringGrade: item.earringGrade,
            })
        }));
    }, [items]);

    const totalScore = useMemo(() => {
        return itemScores.reduce((sum, item) => sum + item.score, 0);
    }, [itemScores]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">기어스코어 계산기</h1>
                <p className="mt-1 text-sm text-gray-500">
                    장비 정보를 입력하면 기어스코어를 계산합니다
                </p>
            </div>

            {/* Total Score */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 shadow rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm opacity-80">총 기어스코어</div>
                        <div className="text-4xl font-bold">{totalScore.toLocaleString()}</div>
                    </div>
                    <Calculator className="w-12 h-12 opacity-50" />
                </div>
                <div className="mt-4 text-sm opacity-80">
                    등록된 장비: {items.length}개
                </div>
            </div>

            {/* Add Item Button */}
            <button
                onClick={addItem}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
            >
                <Plus className="w-4 h-4" />
                장비 추가
            </button>

            {/* Items List */}
            <div className="space-y-4">
                {items.map((item, index) => {
                    const itemScore = itemScores.find(s => s.id === item.id)?.score || 0;

                    return (
                        <div key={item.id} className="bg-white shadow rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-indigo-500" />
                                    장비 {index + 1}
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="text-lg font-bold text-indigo-600">
                                        {itemScore.toLocaleString()} 점
                                    </div>
                                    {items.length > 1 && (
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {/* Slot Type */}
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">장비 타입</label>
                                    <select
                                        value={item.slotType}
                                        onChange={(e) => updateItem(item.id, { slotType: e.target.value as EquipSlotType })}
                                        className="block w-full pl-3 pr-10 py-2 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                                    >
                                        {SLOT_TYPES.map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Level */}
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">장비 레벨</label>
                                    <select
                                        value={item.useLv}
                                        onChange={(e) => updateItem(item.id, { useLv: Number(e.target.value), icorLv: Number(e.target.value) })}
                                        className="block w-full pl-3 pr-10 py-2 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                                    >
                                        {EQUIP_LEVELS.map(lv => (
                                            <option key={lv} value={lv}>{lv}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Grade */}
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">등급</label>
                                    <select
                                        value={item.grade}
                                        onChange={(e) => updateItem(item.id, { grade: Number(e.target.value) })}
                                        className="block w-full pl-3 pr-10 py-2 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                                    >
                                        {Object.entries(GRADE_NAMES).map(([grade, name]) => (
                                            <option key={grade} value={grade}>{name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Reinforce */}
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">강화</label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={30}
                                        value={item.reinforce}
                                        onChange={(e) => updateItem(item.id, { reinforce: Math.min(30, Math.max(0, Number(e.target.value))) })}
                                        className="block w-full pl-3 pr-3 py-2 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                                    />
                                </div>

                                {/* Type-specific fields */}
                                {(item.slotType === 'WEAPON' || item.slotType === 'ARMOR') && (
                                    <>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">초월</label>
                                            <input
                                                type="number"
                                                min={0}
                                                max={10}
                                                value={item.transcend}
                                                onChange={(e) => updateItem(item.id, { transcend: Math.min(10, Math.max(0, Number(e.target.value))) })}
                                                className="block w-full pl-3 pr-3 py-2 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">랜덤옵션 비율 (%)</label>
                                            <input
                                                type="number"
                                                min={0}
                                                max={100}
                                                value={Math.round(item.randomOptionPortion * 100)}
                                                onChange={(e) => updateItem(item.id, { randomOptionPortion: Math.min(100, Math.max(0, Number(e.target.value))) / 100 })}
                                                className="block w-full pl-3 pr-3 py-2 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">인챈트 비율 (%)</label>
                                            <input
                                                type="number"
                                                min={0}
                                                max={100}
                                                value={Math.round(item.enchantPortion * 100)}
                                                onChange={(e) => updateItem(item.id, { enchantPortion: Math.min(100, Math.max(0, Number(e.target.value))) / 100 })}
                                                className="block w-full pl-3 pr-3 py-2 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">젬 포인트</label>
                                            <input
                                                type="number"
                                                min={0}
                                                value={item.gemPoint}
                                                onChange={(e) => updateItem(item.id, { gemPoint: Math.max(0, Number(e.target.value)) })}
                                                className="block w-full pl-3 pr-3 py-2 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                                            />
                                        </div>
                                    </>
                                )}

                                {item.slotType === 'ARK' && (
                                    <>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">아크 레벨</label>
                                            <input
                                                type="number"
                                                min={1}
                                                max={40}
                                                value={item.arkLv}
                                                onChange={(e) => updateItem(item.id, { arkLv: Math.min(40, Math.max(1, Number(e.target.value))) })}
                                                className="block w-full pl-3 pr-3 py-2 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={item.arkHasOption1}
                                                onChange={(e) => updateItem(item.id, { arkHasOption1: e.target.checked })}
                                                className="w-4 h-4 text-indigo-600"
                                            />
                                            <label className="text-xs text-gray-700">옵션 1</label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={item.arkHasOption2}
                                                onChange={(e) => updateItem(item.id, { arkHasOption2: e.target.checked })}
                                                className="w-4 h-4 text-indigo-600"
                                            />
                                            <label className="text-xs text-gray-700">옵션 2</label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={item.isQuestArk}
                                                onChange={(e) => updateItem(item.id, { isQuestArk: e.target.checked })}
                                                className="w-4 h-4 text-indigo-600"
                                            />
                                            <label className="text-xs text-gray-700">퀘스트 아크</label>
                                        </div>
                                    </>
                                )}

                                {item.slotType === 'EARRING' && (
                                    <>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">스탯 합계</label>
                                            <input
                                                type="number"
                                                min={0}
                                                value={item.earringStatSum}
                                                onChange={(e) => updateItem(item.id, { earringStatSum: Math.max(0, Number(e.target.value)) })}
                                                className="block w-full pl-3 pr-3 py-2 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">귀걸이 등급</label>
                                            <input
                                                type="number"
                                                min={0}
                                                max={10}
                                                value={item.earringGrade}
                                                onChange={(e) => updateItem(item.id, { earringGrade: Math.min(10, Math.max(0, Number(e.target.value))) })}
                                                className="block w-full pl-3 pr-3 py-2 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                                            />
                                        </div>
                                    </>
                                )}

                                {(item.slotType === 'BELT' || item.slotType === 'SHOULDER') && (
                                    <div className="flex items-center gap-2 col-span-2">
                                        <input
                                            type="checkbox"
                                            checked={item.isHighOption}
                                            onChange={(e) => updateItem(item.id, { isHighOption: e.target.checked })}
                                            className="w-4 h-4 text-indigo-600"
                                        />
                                        <label className="text-xs text-gray-700">High 등급 옵션</label>
                                    </div>
                                )}

                                {item.slotType === 'SEAL' && (
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-500">
                                            인장은 등급과 강화(인장 레벨)로 점수가 계산됩니다
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Info Panel */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-indigo-500" />
                    기어스코어 계산 공식
                </h3>
                <div className="text-sm text-gray-600 space-y-2">
                    <p><strong>6등급 미만:</strong> 0.5 × (4×초월 + 3×강화) + (30×등급 + 1.66×평균레벨) × 0.5</p>
                    <p><strong>가디스 장비:</strong> (초월×3) + (강화×20) + (레벨차이×20) + 460</p>
                    <p><strong>아크:</strong> 251 + (25.1 × 아크레벨) + (옵션당 250)</p>
                    <p><strong>귀걸이:</strong> 레벨 + (스탯합/20) + (귀걸이등급 × 15)</p>
                    <p><strong>벨트/어깨:</strong> 레벨별 기본점수 × 옵션비율</p>
                </div>
            </div>
        </div>
    );
}
