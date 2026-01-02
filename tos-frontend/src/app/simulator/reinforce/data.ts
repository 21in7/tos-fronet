// 강화 확률 데이터 (item_goddess_reinforce_*.ies 기반)
// BasicProp / 1000 = 확률 %

export interface ReinforceData {
    level: number;
    basicProp: number; // 기본 확률 (100000 = 100%)
    addAtk: number;
    addDef: number;
}

// 540 레벨 장비 기준 강화 데이터
export const REINFORCE_DATA_540: ReinforceData[] = [
    { level: 1, basicProp: 100000, addAtk: 1471, addDef: 15913 },
    { level: 2, basicProp: 100000, addAtk: 1471, addDef: 15913 },
    { level: 3, basicProp: 100000, addAtk: 1471, addDef: 15913 },
    { level: 4, basicProp: 100000, addAtk: 1471, addDef: 15913 },
    { level: 5, basicProp: 100000, addAtk: 1471, addDef: 15913 },
    { level: 6, basicProp: 80000, addAtk: 1471, addDef: 15913 },
    { level: 7, basicProp: 72000, addAtk: 1471, addDef: 15913 },
    { level: 8, basicProp: 64000, addAtk: 1471, addDef: 15913 },
    { level: 9, basicProp: 58000, addAtk: 1471, addDef: 15913 },
    { level: 10, basicProp: 52000, addAtk: 1471, addDef: 15913 },
    { level: 11, basicProp: 33000, addAtk: 883, addDef: 10533 },
    { level: 12, basicProp: 25000, addAtk: 883, addDef: 10533 },
    { level: 13, basicProp: 18000, addAtk: 883, addDef: 10533 },
    { level: 14, basicProp: 14000, addAtk: 883, addDef: 10533 },
    { level: 15, basicProp: 10000, addAtk: 883, addDef: 10533 },
    { level: 16, basicProp: 9000, addAtk: 883, addDef: 10533 },
    { level: 17, basicProp: 8000, addAtk: 883, addDef: 10533 },
    { level: 18, basicProp: 6000, addAtk: 883, addDef: 10533 },
    { level: 19, basicProp: 4000, addAtk: 883, addDef: 10533 },
    { level: 20, basicProp: 3000, addAtk: 883, addDef: 10533 },
    { level: 21, basicProp: 2000, addAtk: 883, addDef: 10533 },
    { level: 22, basicProp: 1000, addAtk: 883, addDef: 10533 },
    { level: 23, basicProp: 1000, addAtk: 883, addDef: 10533 },
    { level: 24, basicProp: 1000, addAtk: 883, addDef: 10533 },
    { level: 25, basicProp: 1000, addAtk: 883, addDef: 10533 },
    { level: 26, basicProp: 1000, addAtk: 883, addDef: 10533 },
    { level: 27, basicProp: 1000, addAtk: 883, addDef: 10533 },
    { level: 28, basicProp: 1000, addAtk: 883, addDef: 10533 },
    { level: 29, basicProp: 1000, addAtk: 883, addDef: 10533 },
    { level: 30, basicProp: 1000, addAtk: 883, addDef: 10533 },
];

// 520 레벨 장비 기준 강화 데이터
export const REINFORCE_DATA_520: ReinforceData[] = [
    { level: 1, basicProp: 100000, addAtk: 1399, addDef: 15155 },
    { level: 2, basicProp: 100000, addAtk: 1399, addDef: 15155 },
    { level: 3, basicProp: 100000, addAtk: 1399, addDef: 15155 },
    { level: 4, basicProp: 100000, addAtk: 1399, addDef: 15155 },
    { level: 5, basicProp: 100000, addAtk: 1399, addDef: 15155 },
    { level: 6, basicProp: 80000, addAtk: 1399, addDef: 15155 },
    { level: 7, basicProp: 72000, addAtk: 1399, addDef: 15155 },
    { level: 8, basicProp: 64000, addAtk: 1399, addDef: 15155 },
    { level: 9, basicProp: 58000, addAtk: 1399, addDef: 15155 },
    { level: 10, basicProp: 52000, addAtk: 1399, addDef: 15155 },
    { level: 11, basicProp: 33000, addAtk: 840, addDef: 10026 },
    { level: 12, basicProp: 25000, addAtk: 840, addDef: 10026 },
    { level: 13, basicProp: 18000, addAtk: 840, addDef: 10026 },
    { level: 14, basicProp: 14000, addAtk: 840, addDef: 10026 },
    { level: 15, basicProp: 10000, addAtk: 840, addDef: 10026 },
    { level: 16, basicProp: 9000, addAtk: 840, addDef: 10026 },
    { level: 17, basicProp: 8000, addAtk: 840, addDef: 10026 },
    { level: 18, basicProp: 6000, addAtk: 840, addDef: 10026 },
    { level: 19, basicProp: 4000, addAtk: 840, addDef: 10026 },
    { level: 20, basicProp: 3000, addAtk: 840, addDef: 10026 },
    { level: 21, basicProp: 2000, addAtk: 840, addDef: 10026 },
    { level: 22, basicProp: 1000, addAtk: 840, addDef: 10026 },
    { level: 23, basicProp: 1000, addAtk: 840, addDef: 10026 },
    { level: 24, basicProp: 1000, addAtk: 840, addDef: 10026 },
    { level: 25, basicProp: 1000, addAtk: 840, addDef: 10026 },
    { level: 26, basicProp: 1000, addAtk: 840, addDef: 10026 },
    { level: 27, basicProp: 1000, addAtk: 840, addDef: 10026 },
    { level: 28, basicProp: 1000, addAtk: 840, addDef: 10026 },
    { level: 29, basicProp: 1000, addAtk: 840, addDef: 10026 },
    { level: 30, basicProp: 1000, addAtk: 840, addDef: 10026 },
];

// 500 레벨 장비 기준 강화 데이터
export const REINFORCE_DATA_500: ReinforceData[] = [
    { level: 1, basicProp: 100000, addAtk: 1330, addDef: 14417 },
    { level: 2, basicProp: 100000, addAtk: 1330, addDef: 14417 },
    { level: 3, basicProp: 100000, addAtk: 1330, addDef: 14417 },
    { level: 4, basicProp: 100000, addAtk: 1330, addDef: 14417 },
    { level: 5, basicProp: 100000, addAtk: 1330, addDef: 14417 },
    { level: 6, basicProp: 80000, addAtk: 1330, addDef: 14417 },
    { level: 7, basicProp: 72000, addAtk: 1330, addDef: 14417 },
    { level: 8, basicProp: 64000, addAtk: 1330, addDef: 14417 },
    { level: 9, basicProp: 58000, addAtk: 1330, addDef: 14417 },
    { level: 10, basicProp: 52000, addAtk: 1330, addDef: 14417 },
    { level: 11, basicProp: 33000, addAtk: 798, addDef: 9536 },
    { level: 12, basicProp: 25000, addAtk: 798, addDef: 9536 },
    { level: 13, basicProp: 18000, addAtk: 798, addDef: 9536 },
    { level: 14, basicProp: 14000, addAtk: 798, addDef: 9536 },
    { level: 15, basicProp: 10000, addAtk: 798, addDef: 9536 },
    { level: 16, basicProp: 9000, addAtk: 798, addDef: 9536 },
    { level: 17, basicProp: 8000, addAtk: 798, addDef: 9536 },
    { level: 18, basicProp: 6000, addAtk: 798, addDef: 9536 },
    { level: 19, basicProp: 4000, addAtk: 798, addDef: 9536 },
    { level: 20, basicProp: 3000, addAtk: 798, addDef: 9536 },
    { level: 21, basicProp: 2000, addAtk: 798, addDef: 9536 },
    { level: 22, basicProp: 1000, addAtk: 798, addDef: 9536 },
    { level: 23, basicProp: 1000, addAtk: 798, addDef: 9536 },
    { level: 24, basicProp: 1000, addAtk: 798, addDef: 9536 },
    { level: 25, basicProp: 1000, addAtk: 798, addDef: 9536 },
    { level: 26, basicProp: 1000, addAtk: 798, addDef: 9536 },
    { level: 27, basicProp: 1000, addAtk: 798, addDef: 9536 },
    { level: 28, basicProp: 1000, addAtk: 798, addDef: 9536 },
    { level: 29, basicProp: 1000, addAtk: 798, addDef: 9536 },
    { level: 30, basicProp: 1000, addAtk: 798, addDef: 9536 },
];

// 480 레벨 장비 기준 강화 데이터
export const REINFORCE_DATA_480: ReinforceData[] = [
    { level: 1, basicProp: 100000, addAtk: 1265, addDef: 13711 },
    { level: 2, basicProp: 100000, addAtk: 1265, addDef: 13711 },
    { level: 3, basicProp: 100000, addAtk: 1265, addDef: 13711 },
    { level: 4, basicProp: 100000, addAtk: 1265, addDef: 13711 },
    { level: 5, basicProp: 100000, addAtk: 1265, addDef: 13711 },
    { level: 6, basicProp: 80000, addAtk: 1265, addDef: 13711 },
    { level: 7, basicProp: 72000, addAtk: 1265, addDef: 13711 },
    { level: 8, basicProp: 64000, addAtk: 1265, addDef: 13711 },
    { level: 9, basicProp: 58000, addAtk: 1265, addDef: 13711 },
    { level: 10, basicProp: 52000, addAtk: 1265, addDef: 13711 },
    { level: 11, basicProp: 33000, addAtk: 759, addDef: 9070 },
    { level: 12, basicProp: 25000, addAtk: 759, addDef: 9070 },
    { level: 13, basicProp: 18000, addAtk: 759, addDef: 9070 },
    { level: 14, basicProp: 14000, addAtk: 759, addDef: 9070 },
    { level: 15, basicProp: 10000, addAtk: 759, addDef: 9070 },
    { level: 16, basicProp: 9000, addAtk: 759, addDef: 9070 },
    { level: 17, basicProp: 8000, addAtk: 759, addDef: 9070 },
    { level: 18, basicProp: 6000, addAtk: 759, addDef: 9070 },
    { level: 19, basicProp: 4000, addAtk: 759, addDef: 9070 },
    { level: 20, basicProp: 3000, addAtk: 759, addDef: 9070 },
    { level: 21, basicProp: 2000, addAtk: 759, addDef: 9070 },
    { level: 22, basicProp: 1000, addAtk: 759, addDef: 9070 },
    { level: 23, basicProp: 1000, addAtk: 759, addDef: 9070 },
    { level: 24, basicProp: 1000, addAtk: 759, addDef: 9070 },
    { level: 25, basicProp: 1000, addAtk: 759, addDef: 9070 },
    { level: 26, basicProp: 1000, addAtk: 759, addDef: 9070 },
    { level: 27, basicProp: 1000, addAtk: 759, addDef: 9070 },
    { level: 28, basicProp: 1000, addAtk: 759, addDef: 9070 },
    { level: 29, basicProp: 1000, addAtk: 759, addDef: 9070 },
    { level: 30, basicProp: 1000, addAtk: 759, addDef: 9070 },
];

export const REINFORCE_DATA_BY_LEVEL: Record<number, ReinforceData[]> = {
    480: REINFORCE_DATA_480,
    500: REINFORCE_DATA_500,
    520: REINFORCE_DATA_520,
    540: REINFORCE_DATA_540,
};

export const EQUIPMENT_LEVELS = [480, 500, 520, 540];

// 강화 파라미터 (shared_item_goddess_reinforce.lua 기반)
export const REINFORCE_PARAMS = {
    REINFORCE_FAIL_REVISION_RATIO: 0.1, // 10% - 강화 실패 보정 비율
    MAX_FAIL_REVISION: 70000, // 70% - 최대 보정확률
    MAX_SUB_REVISION_COUNT: 3, // 강화 보조제 최대 적용 개수
    SUB_REVISION_RATIO: 0.2, // 20% - 강화 보조제 보정 비율
    MAX_PREMIUM_SUB_REVISION_COUNT: 2, // 프리미엄 보조제 최대 적용 개수
    PREMIUM_SUB_REVISION_RATIO: 0.2, // 20% - 프리미엄 보조제 보정 비율
    MAX_REINFORCE_POINT: 30, // 최대 강화 수치
};
