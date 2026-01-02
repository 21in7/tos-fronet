// 기어스코어 계산 관련 데이터 및 유틸리티

// 장비 슬롯 타입
export type EquipSlotType =
    | 'WEAPON' // 무기 (RH/LH/양손)
    | 'ARMOR' // 방어구 (SHIRT/GLOVES/BOOTS/PANTS)
    | 'ACCESSORY' // 악세서리 (RING/NECK)
    | 'SEAL' // 인장
    | 'ARK' // 아크
    | 'EARRING' // 귀걸이
    | 'BELT' // 벨트
    | 'SHOULDER'; // 어깨

// 장비 등급
export const GRADE_NAMES: Record<number, string> = {
    1: '노말',
    2: '매직',
    3: '레어',
    4: '유니크',
    5: '레전드',
    6: '가디스',
};

// 벨트/어깨 레벨별 기본 스코어
export const BELT_BASE_SCORE: Record<number, number> = {
    470: 900,
    480: 900,
    510: 1100,
    540: 1200,
};

// 귀걸이 레벨
export const EARRING_LEVELS = [470, 480, 490, 500, 510, 520, 530];

// 인장 레벨
export const SEAL_DATA = [
    { name: 'Seal_jurate', displayName: '주라테 인장', score: 1000 },
    { name: 'Seal_jurate2', displayName: '주라테 인장 II', score: 1200 },
    { name: 'Seal_jurate3', displayName: '주라테 인장 III', score: 1400 },
    { name: 'Seal_jurate4', displayName: '주라테 인장 IV', score: 1600 },
];

// 기어스코어 계산: 무기/방어구
export function calculateGearScore(params: {
    slotType: EquipSlotType;
    useLv: number;
    grade: number;
    reinforce: number;
    transcend: number;
    icorLv?: number;
    randomIcorLv?: number;
    randomOptionPortion?: number; // 0~1
    enchantPortion?: number; // 0~1
    gemPoint?: number;
    isHighOption?: boolean;
    arkLv?: number;
    arkHasOption1?: boolean;
    arkHasOption2?: boolean;
    isQuestArk?: boolean;
    earringStatSum?: number;
    earringGrade?: number;
}): number {
    const {
        slotType,
        useLv,
        grade,
        reinforce,
        transcend,
        icorLv = useLv,
        randomIcorLv = 0,
        randomOptionPortion = 1,
        enchantPortion = 1,
        gemPoint = 0,
        isHighOption = false,
        arkLv = 1,
        arkHasOption1 = false,
        arkHasOption2 = false,
        isQuestArk = false,
        earringStatSum = 0,
        earringGrade = 0,
    } = params;

    // 인장
    if (slotType === 'SEAL') {
        const ret = ((0.7 * (100 * reinforce)) + ((1100 * grade) + (1 * useLv)) * 0.3) * 0.26;
        return Math.floor(ret + 0.5);
    }

    // 아크
    if (slotType === 'ARK') {
        const questPenalty = isQuestArk ? 0.95 : 1.0;
        let ret = 251 + (25.1 * arkLv);
        if (arkHasOption1) ret += 250;
        if (arkHasOption2) ret += 250;
        ret = ret * questPenalty;
        return Math.floor(ret + 0.5);
    }

    // 귀걸이
    if (slotType === 'EARRING') {
        let score = useLv;
        score += Math.floor(earringStatSum / 20);
        score += earringGrade * 15;
        return score;
    }

    // 벨트/어깨
    if (slotType === 'BELT' || slotType === 'SHOULDER') {
        const baseScore = BELT_BASE_SCORE[useLv] || 700;
        const highBonus = isHighOption ? 100 : 0;
        // 옵션 비율 적용 (90% 기본 + 10% 옵션 비율)
        const optionRatio = randomOptionPortion;
        const score = Math.floor((baseScore * 0.9) + (baseScore * 0.1 * optionRatio)) + highBonus;
        return score;
    }

    // 무기/방어구/악세서리
    const avgLv = slotType === 'ACCESSORY'
        ? useLv
        : Math.floor((useLv * 0.5) + ((icorLv + useLv + randomIcorLv) * 0.33334 * 0.5) + 0.5);

    // 악세서리 추가 점수
    let addAcc = 0;
    if (slotType === 'ACCESSORY') {
        if (grade >= 6 && useLv >= 470) {
            addAcc = 100 + Math.max(0, (useLv - 470) * (useLv > 490 ? 18 : 20));
        } else if (grade >= 6) {
            addAcc = 100;
        } else {
            addAcc = 30;
        }
    }

    // 옵션 패널티 계산 (6등급 470레벨 이상은 패널티 없음)
    let randomOptionPenalty = 0;
    let enchantOptionPenalty = 0;

    if (!(grade >= 6 && useLv >= 470) && slotType !== 'ACCESSORY') {
        randomOptionPenalty = 0.05 * (1 - randomOptionPortion);
        enchantOptionPenalty = 0.05 * (1 - enchantPortion);
    }

    const setOption = 1 - randomOptionPenalty - enchantOptionPenalty;

    // 세트 이점 (가디스 장비는 1.0)
    const setAdvantage = grade >= 6 && useLv >= 480 ? 1.0 : 0.9;

    // 6등급 470레벨 이상은 초월 10 고정
    const effectiveTranscend = (grade >= 6 && useLv >= 470) ? 10 : transcend;

    let ret: number;
    if (grade < 6) {
        // 6등급 미만
        ret = 0.5 * ((4 * effectiveTranscend) + (3 * reinforce)) + ((30 * grade) + (1.66 * avgLv)) * 0.5;
    } else {
        // 6등급 이상 (가디스)
        const reinforceRatio = 20;
        const transcendRatio = 3;
        let diff = avgLv - 460;
        if (useLv >= 480) {
            diff = useLv - 460;
        }
        diff = Math.max(0, diff);

        ret = (effectiveTranscend * transcendRatio) + (reinforceRatio * reinforce) + (diff * reinforceRatio) + 460;
        ret = ret * Math.min(1, avgLv / useLv);
    }

    ret = ret * setOption * setAdvantage + addAcc + gemPoint;

    return Math.floor(ret + 0.5);
}

// 총 기어스코어 계산 (14개 슬롯 기준)
export function calculateTotalGearScore(items: { score: number; slotType: EquipSlotType }[]): number {
    const total = 14;
    let score = items.reduce((sum, item) => sum + item.score, 0);

    // 서브 무기 미착용 시 보정
    const missingCount = Math.max(0, total - items.length);
    if (missingCount > 0) {
        const div = total - missingCount;
        if (div > 0) {
            const add = Math.floor(score / div * missingCount);
            score += add;
        }
    }

    return Math.floor(score + 0.5);
}
