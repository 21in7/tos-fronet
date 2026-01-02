export interface ExhibitionItem {
  ClassID: number;
  cost: number;
  OptionCount: number;
  ClassName: string;
  Name: string;
  OptionPool: string;
}

export interface OptionData {
  ClassID: number;
  Grade: number;
  Weight: number;
  MinValue: number;
  MaxValue: number;
  ClassName: string;
  Type: "Effect" | "Stat";
  Stat: string;
  Desc: string;
}

export const EXHIBITION_ITEMS: ExhibitionItem[] = [
  { ClassID: 6, cost: 3, OptionCount: 1, ClassName: "Arc_Klaipeda_Ancient_Lamp", Name: "[고고학] 고대 크리스탈 램프", OptionPool: "1;2;4;5;7;8;10;11" },
  { ClassID: 7, cost: 4, OptionCount: 2, ClassName: "Arc_Klaipeda_Gele_Totem", Name: "[고고학] 고대 부족 토템", OptionPool: "2;3;5;6;8;9;11;12;16;17;19;20" },
  { ClassID: 8, cost: 5, OptionCount: 2, ClassName: "Arc_Orsha_Royal_Seal", Name: "[고고학] 왕실 인장", OptionPool: "3;6;9;12;15;18;21;24" },
  { ClassID: 9, cost: 3, OptionCount: 1, ClassName: "Arc_Fedimian_War_Helm", Name: "[고고학] 로카스 투구", OptionPool: "1;4;7;10;13;16;19;22" },
  { ClassID: 10, cost: 4, OptionCount: 2, ClassName: "Arc_Fedimian_Holy_Relic", Name: "[고고학] 나모트 성유물", OptionPool: "2;5;8;11;14;17;20;23" },
  { ClassID: 11, cost: 4, OptionCount: 2, ClassName: "Arc_Forest_Spirit_Stone", Name: "[고고학] 정령의 숨결석", OptionPool: "1;2;3;7;8;9;10;11;12;16;17;18" },
  { ClassID: 12, cost: 3, OptionCount: 1, ClassName: "Arc_Kallis_Monolith", Name: "[고고학] 대지의 비석 조각", OptionPool: "4;5;6;10;11;12;13;14;15" },
  { ClassID: 13, cost: 5, OptionCount: 3, ClassName: "Arc_Starry_Astrolabe", Name: "[고고학] 고대 천체 관측기", OptionPool: "3;6;9;12;15;18;21;24" },
  { ClassID: 14, cost: 4, OptionCount: 2, ClassName: "Arc_Royal_Sword", Name: "[고고학] 고대 의례용 검", OptionPool: "2;3;5;6;8;9;11;12;14;15;17;18;20;21;23;24" },
  { ClassID: 15, cost: 5, OptionCount: 3, ClassName: "Arc_Ashaq_Grimoire", Name: "[고고학] 고대 마법서", OptionPool: "1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16;17;18;19;20;21;22;23;24" },
  { ClassID: 16, cost: 6, OptionCount: 2, ClassName: "Arc_Saule_Golden_Crown", Name: "[고고학] 고대 왕관", OptionPool: "6;9;12;15;18;21;24;27;30;33" },
  { ClassID: 17, cost: 4, OptionCount: 2, ClassName: "Arc_Saule_Holy_Chalice", Name: "[고고학] 고대 어깨 방어구", OptionPool: "8;9;11;12;16;17;18;26;29;32;43;44" },
  { ClassID: 18, cost: 3, OptionCount: 1, ClassName: "Arc_Dina_Bee_Spirit_Mask", Name: "[고고학] 고대 정령의 가면", OptionPool: "1;2;4;5;7;8;10;11" },
  { ClassID: 19, cost: 3, OptionCount: 1, ClassName: "Arc_Dina_Bee_Crystal", Name: "[고고학] 고대의 꿀", OptionPool: "1;2;4;5;7;8;22;23" },
  { ClassID: 20, cost: 7, OptionCount: 3, ClassName: "Arc_Vakarine_Moon_Shield", Name: "[고고학] 달빛 수호자의 방패", OptionPool: "9;12;15;18;21;24;27;30;33;39;42;48" },
  { ClassID: 21, cost: 5, OptionCount: 2, ClassName: "Arc_Vakarine_Goddess_Statue", Name: "[고고학] 금이 간 여신상", OptionPool: "8;9;11;12;14;15;17;18;20;21;23;24;26;29;32;38;41;44" },
  { ClassID: 22, cost: 4, OptionCount: 2, ClassName: "Arc_Siaulai_Druid_Staff", Name: "[고고학] 드루이드의 지팡이", OptionPool: "2;3;5;6;11;12;14;15;19;20;21" },
  { ClassID: 23, cost: 3, OptionCount: 1, ClassName: "Arc_Siaulai_Nature_Stone", Name: "[고고학] 자연의 수호석", OptionPool: "1;2;4;5;10;11;13;14" },
  { ClassID: 24, cost: 3, OptionCount: 1, ClassName: "Arc_Tenet_Flower_Fossil", Name: "[고고학] 여신의 꽃 화석", OptionPool: "1;2;4;5;7;8;16;17;22;23" },
  { ClassID: 25, cost: 4, OptionCount: 2, ClassName: "Arc_Tenet_Eternal_Wood", Name: "[고고학] 오래된 나무 조각", OptionPool: "2;3;5;6;11;12;13;14;15;16;17;18" },
  { ClassID: 26, cost: 3, OptionCount: 1, ClassName: "Arc_Lemprasa_Iron_Axe", Name: "[고고학] 고대 부족의 도끼", OptionPool: "1;2;4;5;10;11;19;20" },
  { ClassID: 27, cost: 2, OptionCount: 1, ClassName: "Arc_Lemprasa_Miner_Hammer", Name: "[고고학] 광산 노동자의 망치", OptionPool: "1;4;7;10;13;16;19;22" },
  { ClassID: 28, cost: 4, OptionCount: 2, ClassName: "Arc_Tantra_Warrior_Sword", Name: "[고고학] 고대 전사의 검", OptionPool: "2;3;5;6;8;9;16;17;18;22;23;24;26;29;35;38;44;53" },
  { ClassID: 29, cost: 3, OptionCount: 1, ClassName: "Arc_Tantra_Battle_Banner", Name: "[고고학] 전투의 깃발 조각", OptionPool: "1;2;4;5;7;8;10;11;22;23;25;28;31;37;40" },
  { ClassID: 30, cost: 3, OptionCount: 1, ClassName: "Arc_Manor_Pocket_Watch", Name: "[고고학] 손상된 회중시계", OptionPool: "1;2;4;5;13;14;19;20" },
  { ClassID: 31, cost: 5, OptionCount: 2, ClassName: "Arc_Manor_Ornate_Mirror", Name: "[고고학] 거울 조각", OptionPool: "2;3;5;6;8;9;11;12;14;15;17;18;20;21;23;24;38;41;50" },
  { ClassID: 32, cost: 3, OptionCount: 1, ClassName: "Arc_Train_Steam_Part", Name: "[고고학] 고대 기관 부품", OptionPool: "1;2;4;5;10;11;19;20" },
  { ClassID: 33, cost: 4, OptionCount: 2, ClassName: "Arc_Train_Clock_Device", Name: "[고고학] 고대 시계 장치", OptionPool: "2;3;5;6;8;9;11;12;16;17;18;19;20;21" },
  { ClassID: 34, cost: 5, OptionCount: 2, ClassName: "Arc_Alchemist_Flask", Name: "[고고학] 연금술사의 플라스크", OptionPool: "2;3;5;6;8;9;10;11;12;16;17;18;26;32;44;47" },
  { ClassID: 35, cost: 6, OptionCount: 3, ClassName: "Arc_Alchemist_Crystal", Name: "[고고학] 마법 증폭 수정", OptionPool: "3;6;9;12;15;18;21;24;27;30;33;36;39;42;45;48;51;46" }
];

export const OPTION_DATA: OptionData[] = [
  { ClassID: 1, Grade: 1, Weight: 100, MinValue: 1, MaxValue: 3, ClassName: "COIN_GAIN_LOW", Type: "Effect", Stat: "ARCHEOLOGY_COIN_GAIN", Desc: "일반 유물 추가 획득 확률" },
  { ClassID: 2, Grade: 2, Weight: 60, MinValue: 3, MaxValue: 7, ClassName: "COIN_GAIN_MID", Type: "Effect", Stat: "ARCHEOLOGY_COIN_GAIN", Desc: "일반 유물 추가 획득 확률" },
  { ClassID: 3, Grade: 3, Weight: 35, MinValue: 7, MaxValue: 12, ClassName: "COIN_GAIN_HIGH", Type: "Effect", Stat: "ARCHEOLOGY_COIN_GAIN", Desc: "일반 유물 추가 획득 확률" },
  { ClassID: 4, Grade: 1, Weight: 100, MinValue: 10, MaxValue: 30, ClassName: "DETECT_RANGE_LOW", Type: "Effect", Stat: "ARCHEOLOGY_DETECTING", Desc: "탐지기 유효 범위 증가" },
  { ClassID: 5, Grade: 2, Weight: 60, MinValue: 30, MaxValue: 70, ClassName: "DETECT_RANGE_MID", Type: "Effect", Stat: "ARCHEOLOGY_DETECTING", Desc: "탐지기 유효 범위 증가" },
  { ClassID: 6, Grade: 3, Weight: 35, MinValue: 70, MaxValue: 120, ClassName: "DETECT_RANGE_HIGH", Type: "Effect", Stat: "ARCHEOLOGY_DETECTING", Desc: "탐지기 유효 범위 증가" },
  { ClassID: 7, Grade: 1, Weight: 100, MinValue: 3, MaxValue: 7, ClassName: "RARE_FIND_LOW", Type: "Effect", Stat: "ARCHEOLOGY_RARE_CHANCE", Desc: "발굴 시 희귀 유물 발견 확률 증가 (%)" },
  { ClassID: 8, Grade: 2, Weight: 60, MinValue: 7, MaxValue: 15, ClassName: "RARE_FIND_MID", Type: "Effect", Stat: "ARCHEOLOGY_RARE_CHANCE", Desc: "발굴 시 희귀 유물 발견 확률 증가 (%)" },
  { ClassID: 9, Grade: 3, Weight: 35, MinValue: 15, MaxValue: 25, ClassName: "RARE_FIND_HIGH", Type: "Effect", Stat: "ARCHEOLOGY_RARE_CHANCE", Desc: "발굴 시 희귀 유물 발견 확률 증가 (%)" },
  { ClassID: 10, Grade: 1, Weight: 100, MinValue: 5, MaxValue: 10, ClassName: "QUALITY_UP_LOW", Type: "Effect", Stat: "ARCHEOLOGY_QUALITY_BONUS", Desc: "몬스터 처치 시 유물 상태 등급 향상 확률 (%)" },
  { ClassID: 11, Grade: 2, Weight: 60, MinValue: 10, MaxValue: 20, ClassName: "QUALITY_UP_MID", Type: "Effect", Stat: "ARCHEOLOGY_QUALITY_BONUS", Desc: "몬스터 처치 시 유물 상태 등급 향상 확률 (%)" },
  { ClassID: 12, Grade: 3, Weight: 35, MinValue: 20, MaxValue: 35, ClassName: "QUALITY_UP_HIGH", Type: "Effect", Stat: "ARCHEOLOGY_QUALITY_BONUS", Desc: "몬스터 처치 시 유물 상태 등급 향상 확률 (%)" },
  { ClassID: 13, Grade: 1, Weight: 100, MinValue: 5, MaxValue: 10, ClassName: "EXP_BONUS_LOW", Type: "Effect", Stat: "ARCHEOLOGY_SPECIAL_REWARD", Desc: "고대인의 유실물 수량 증가률 (%)" },
  { ClassID: 14, Grade: 2, Weight: 60, MinValue: 10, MaxValue: 20, ClassName: "EXP_BONUS_MID", Type: "Effect", Stat: "ARCHEOLOGY_SPECIAL_REWARD", Desc: "고대인의 유실물 수량 증가률 (%)" },
  { ClassID: 15, Grade: 3, Weight: 35, MinValue: 20, MaxValue: 40, ClassName: "EXP_BONUS_HIGH", Type: "Effect", Stat: "ARCHEOLOGY_SPECIAL_REWARD", Desc: "고대인의 유실물 수량 증가률 (%)" },
  { ClassID: 16, Grade: 1, Weight: 100, MinValue: 1, MaxValue: 2, ClassName: "CRITICAL_DIG_LOW", Type: "Effect", Stat: "ARCHEOLOGY_CRITICAL_CHANCE", Desc: "크리티컬 발굴 확률 - 보상 2배 (%)" },
  { ClassID: 17, Grade: 2, Weight: 60, MinValue: 2, MaxValue: 3, ClassName: "CRITICAL_DIG_MID", Type: "Effect", Stat: "ARCHEOLOGY_CRITICAL_CHANCE", Desc: "크리티컬 발굴 확률 - 보상 2배 (%)" },
  { ClassID: 18, Grade: 3, Weight: 35, MinValue: 3, MaxValue: 5, ClassName: "CRITICAL_DIG_HIGH", Type: "Effect", Stat: "ARCHEOLOGY_CRITICAL_CHANCE", Desc: "크리티컬 발굴 확률 - 보상 2배 (%)" },
  { ClassID: 19, Grade: 1, Weight: 60, MinValue: 1, MaxValue: 2, ClassName: "DIG_COUNT_LOW", Type: "Effect", Stat: "ARCHEOLOGY_MON_FIND", Desc: "몬스터 발견 확률 증가" },
  { ClassID: 20, Grade: 2, Weight: 30, MinValue: 2, MaxValue: 4, ClassName: "DIG_COUNT_MID", Type: "Effect", Stat: "ARCHEOLOGY_MON_FIND", Desc: "몬스터 발견 확률 증가" },
  { ClassID: 21, Grade: 3, Weight: 15, MinValue: 4, MaxValue: 6, ClassName: "DIG_COUNT_HIGH", Type: "Effect", Stat: "ARCHEOLOGY_MON_FIND", Desc: "몬스터 발견 확률 증가" },
  { ClassID: 22, Grade: 1, Weight: 100, MinValue: 5, MaxValue: 10, ClassName: "DOUBLE_DROP_LOW", Type: "Effect", Stat: "ARCHEOLOGY_DOUBLE_DROP", Desc: "처치 시 추가 유물 동시 획득 확률 (%)" },
  { ClassID: 23, Grade: 2, Weight: 60, MinValue: 10, MaxValue: 20, ClassName: "DOUBLE_DROP_MID", Type: "Effect", Stat: "ARCHEOLOGY_DOUBLE_DROP", Desc: "처치 시 추가 유물 동시 획득 확률 (%)" },
  { ClassID: 24, Grade: 3, Weight: 35, MinValue: 20, MaxValue: 35, ClassName: "DOUBLE_DROP_HIGH", Type: "Effect", Stat: "ARCHEOLOGY_DOUBLE_DROP", Desc: "처치 시 추가 유물 동시 획득 확률 (%)" },
  { ClassID: 25, Grade: 1, Weight: 90, MinValue: 5000, MaxValue: 10000, ClassName: "HP_BONUS_LOW", Type: "Stat", Stat: "ARCHEOLOGY_HP_BONUS", Desc: "최대 HP 증가" },
  { ClassID: 26, Grade: 2, Weight: 50, MinValue: 10000, MaxValue: 15000, ClassName: "HP_BONUS_MID", Type: "Stat", Stat: "ARCHEOLOGY_HP_BONUS", Desc: "최대 HP 증가" },
  { ClassID: 27, Grade: 3, Weight: 25, MinValue: 15000, MaxValue: 20000, ClassName: "HP_BONUS_HIGH", Type: "Stat", Stat: "ARCHEOLOGY_HP_BONUS", Desc: "최대 HP 증가" },
  { ClassID: 28, Grade: 1, Weight: 90, MinValue: 500, MaxValue: 2000, ClassName: "DEF_BONUS_LOW", Type: "Stat", Stat: "ARCHEOLOGY_DEF_BONUS", Desc: "물리 방어력 증가" },
  { ClassID: 29, Grade: 2, Weight: 50, MinValue: 2000, MaxValue: 3000, ClassName: "DEF_BONUS_MID", Type: "Stat", Stat: "ARCHEOLOGY_DEF_BONUS", Desc: "물리 방어력 증가" },
  { ClassID: 30, Grade: 3, Weight: 25, MinValue: 3000, MaxValue: 4000, ClassName: "DEF_BONUS_HIGH", Type: "Stat", Stat: "ARCHEOLOGY_DEF_BONUS", Desc: "물리 방어력 증가" },
  { ClassID: 31, Grade: 1, Weight: 90, MinValue: 500, MaxValue: 2000, ClassName: "MDEF_BONUS_LOW", Type: "Stat", Stat: "ARCHEOLOGY_MDEF_BONUS", Desc: "마법 방어력 증가" },
  { ClassID: 32, Grade: 2, Weight: 50, MinValue: 2000, MaxValue: 3000, ClassName: "MDEF_BONUS_MID", Type: "Stat", Stat: "ARCHEOLOGY_MDEF_BONUS", Desc: "마법 방어력 증가" },
  { ClassID: 33, Grade: 3, Weight: 25, MinValue: 3000, MaxValue: 4000, ClassName: "MDEF_BONUS_HIGH", Type: "Stat", Stat: "ARCHEOLOGY_MDEF_BONUS", Desc: "마법 방어력 증가" },
  { ClassID: 34, Grade: 1, Weight: 100, MinValue: 0.5, MaxValue: 1.5, ClassName: "MON_DROP_RATE_LOW", Type: "Effect", Stat: "ARCHEOLOGY_MON_DROP_RATE", Desc: "고고학 몬스터 처치 시 아이템 드롭률 증가 (%)" },
  { ClassID: 35, Grade: 2, Weight: 60, MinValue: 1.5, MaxValue: 3.5, ClassName: "MON_DROP_RATE_MID", Type: "Effect", Stat: "ARCHEOLOGY_MON_DROP_RATE", Desc: "고고학 몬스터 처치 시 아이템 드롭률 증가 (%)" },
  { ClassID: 36, Grade: 3, Weight: 35, MinValue: 3.5, MaxValue: 7.5, ClassName: "MON_DROP_RATE_HIGH", Type: "Effect", Stat: "ARCHEOLOGY_MON_DROP_RATE", Desc: "고고학 몬스터 처치 시 아이템 드롭률 증가 (%)" },
  { ClassID: 37, Grade: 1, Weight: 90, MinValue: 10, MaxValue: 30, ClassName: "DODGE_BONUS_LOW", Type: "Stat", Stat: "ARCHEOLOGY_DODGE", Desc: "회피 증가" },
  { ClassID: 38, Grade: 2, Weight: 50, MinValue: 30, MaxValue: 70, ClassName: "DODGE_BONUS_MID", Type: "Stat", Stat: "ARCHEOLOGY_DODGE", Desc: "회피 증가" },
  { ClassID: 39, Grade: 3, Weight: 25, MinValue: 70, MaxValue: 150, ClassName: "DODGE_BONUS_HIGH", Type: "Stat", Stat: "ARCHEOLOGY_DODGE", Desc: "회피 증가" },
  { ClassID: 40, Grade: 1, Weight: 90, MinValue: 15, MaxValue: 45, ClassName: "CRIT_RES_LOW", Type: "Stat", Stat: "ARCHEOLOGY_CRIT_RES", Desc: "크리티컬 저항 증가" },
  { ClassID: 41, Grade: 2, Weight: 50, MinValue: 45, MaxValue: 105, ClassName: "CRIT_RES_MID", Type: "Stat", Stat: "ARCHEOLOGY_CRIT_RES", Desc: "크리티컬 저항 증가" },
  { ClassID: 42, Grade: 3, Weight: 25, MinValue: 105, MaxValue: 225, ClassName: "CRIT_RES_HIGH", Type: "Stat", Stat: "ARCHEOLOGY_CRIT_RES", Desc: "크리티컬 저항 증가" },
  { ClassID: 43, Grade: 1, Weight: 90, MinValue: 0.5, MaxValue: 1, ClassName: "HP_RECOVER_ON_KILL_LOW", Type: "Effect", Stat: "ARCHEOLOGY_HP_ON_KILL", Desc: "고고학 몬스터 처치 시 HP 회복 (%)" },
  { ClassID: 44, Grade: 2, Weight: 50, MinValue: 1, MaxValue: 2, ClassName: "HP_RECOVER_ON_KILL_MID", Type: "Effect", Stat: "ARCHEOLOGY_HP_ON_KILL", Desc: "고고학 몬스터 처치 시 HP 회복 (%)" },
  { ClassID: 45, Grade: 3, Weight: 25, MinValue: 2, MaxValue: 4, ClassName: "HP_RECOVER_ON_KILL_HIGH", Type: "Effect", Stat: "ARCHEOLOGY_HP_ON_KILL", Desc: "고고학 몬스터 처치 시 HP 회복 (%)" },
  { ClassID: 46, Grade: 2, Weight: 15, MinValue: 1, MaxValue: 4, ClassName: "DMG_REDUCE", Type: "Stat", Stat: "ARCHEOLOGY_DMG_REDUCE", Desc: "받는 데미지 감소 (%)" },
  { ClassID: 47, Grade: 1, Weight: 80, MinValue: 1, MaxValue: 1, ClassName: "MOVE_SPEED_LOW", Type: "Stat", Stat: "ARCHEOLOGY_MOVE_SPEED", Desc: "이동 속도 증가" },
  { ClassID: 48, Grade: 2, Weight: 40, MinValue: 2, MaxValue: 2, ClassName: "MOVE_SPEED_MID", Type: "Stat", Stat: "ARCHEOLOGY_MOVE_SPEED", Desc: "이동 속도 증가" },
  { ClassID: 49, Grade: 3, Weight: 15, MinValue: 3, MaxValue: 3, ClassName: "MOVE_SPEED_HIGH", Type: "Stat", Stat: "ARCHEOLOGY_MOVE_SPEED", Desc: "이동 속도 증가" },
  { ClassID: 50, Grade: 1, Weight: 90, MinValue: 25, MaxValue: 75, ClassName: "BLOCK_PEN_LOW", Type: "Stat", Stat: "ARCHEOLOGY_BLOCK_PEN", Desc: "블록 관통 증가" },
  { ClassID: 51, Grade: 2, Weight: 50, MinValue: 75, MaxValue: 175, ClassName: "BLOCK_PEN_MID", Type: "Stat", Stat: "ARCHEOLOGY_BLOCK_PEN", Desc: "블록 관통 증가" },
  { ClassID: 52, Grade: 3, Weight: 25, MinValue: 175, MaxValue: 350, ClassName: "BLOCK_PEN_HIGH", Type: "Stat", Stat: "ARCHEOLOGY_BLOCK_PEN", Desc: "블록 관통 증가" }
];
