// API 응답 기본 타입
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  timestamp: string;
}

export interface ApiError {
  success: false;
  message: string;
  details?: string;
  timestamp: string;
}

// Attributes 타입
export interface Attribute {
  id: number;
  ids: string;
  id_name: string;
  name: string;
  descriptions: string;
  descriptions_required?: string;
  description?: string; // 호환성을 위해 유지
  type?: 'strength' | 'agility' | 'intelligence' | 'vitality' | 'luck'; // 호환성을 위해 유지
  base_value?: number; // 호환성을 위해 유지
  max_value?: number; // 호환성을 위해 유지
  icon?: string;
  icon_url?: string;
  is_toggleable: number;
  max_lv: number;
  created: string;
  updated: string;
  created_at?: string; // 호환성을 위해 유지
  updated_at?: string; // 호환성을 위해 유지
}

// Buffs 타입
export interface Buff {
  id: number;
  ids: string;
  id_name: string;
  name: string;
  descriptions: string;
  descriptions_required?: string;
  description?: string; // 호환성을 위해 유지
  icon?: string;
  icon_url?: string;
  is_toggleable?: number;
  max_lv?: number;
  duration?: number; // 버프 지속시간
  cooldown?: number; // 재사용 대기시간
  effect_type?: string; // 효과 타입
  created: string;
  updated: string;
  created_at?: string; // 호환성을 위해 유지
  updated_at?: string; // 호환성을 위해 유지
}

// Equipment 타입
export interface Equipment {
  item_id: number;
  durability: number;
  level: number;
  potential: number;
  requiredClass: string;
  sockets_limit: number;
  stars: number;
  matk: number;
  patk: number;
  patk_max: number;
  mdef: number;
  pdef: number;
  type_attack: string;
  type_equipment: string;
  unidentified: number;
  unidentifiedRandom: number;
  anvil_atk: string;
  anvil_def: string;
  anvil_price: string;
  transcend_price: string;
  bonuses: unknown[];
}

// Items 타입
export interface Item {
  id: number;
  ids: string;
  id_name: string;
  name: string;
  descriptions: string;
  description?: string; // 호환성을 위해 유지
  weight: number;
  tradability: string;
  type: string;
  grade: number;
  cooldown: number;
  icon: string;
  icon_url: string;
  equipment?: Equipment;
  // 호환성을 위해 기존 필드들 유지
  rarity?: string;
  level?: number;
  price?: number;
  stats?: Record<string, unknown>;
  stackable?: boolean;
  created: string;
  updated: string;
  created_at?: string; // 호환성을 위해 유지
  updated_at?: string; // 호환성을 위해 유지
}

// Monsters 타입
export interface Monster {
  id: number;
  ids: string;
  id_name: string;
  name: string;
  descriptions: string;
  description?: string; // 호환성을 위해 유지
  level: number;
  hp?: number;
  exp?: number;
  exp_class?: number;
  race?: string;
  rank?: string;
  size?: string;
  element?: string;
  armor?: string | null;
  icon?: string;
  // 공격 관련
  patk_min?: number;
  patk_max?: number;
  matk_min?: number;
  matk_max?: number;
  accuracy?: number;
  critrate?: number;
  critdmg?: number;
  blockpen?: number;
  // 방어 관련
  pdef?: number;
  mdef?: number;
  eva?: number;
  critdef?: number;
  block?: number;
  // 능력치
  stat_str?: number;
  stat_con?: number;
  stat_int?: number;
  stat_spr?: number;
  stat_dex?: number;
  // 메타 데이터
  icon_url?: string;
  created: string;
  updated: string;
  created_at?: string; // 호환성을 위해 유지
  updated_at?: string; // 호환성을 위해 유지
}

// Skills 타입
export interface Skill {
  id: number;
  ids: number;
  name: string;
  description: string;
  descriptions?: string; // API Actual Response
  type?: string;
  level?: number;
  max_level?: number; // 메인 Max Level 필드 (예상)
  max_lv?: number; // 대체 Max Level 필드
  cooldown?: number;
  cost?: number;
  mana_cost?: number;
  damage?: number;
  range?: number;
  element?: string;
  effects?: Record<string, unknown>;
  requirements?: Record<string, unknown>;
  job_id?: number;
  icon_url?: string;
  created_at: string;
  updated_at: string;
}

// Jobs 타입
export interface Job {
  id: number;
  ids: number;
  name: string;
  description?: string;
  descriptions?: string;
  type?: string;
  rank?: string;
  job_tree?: string;
  requirements?: Record<string, unknown>;
  bonuses?: Record<string, unknown>;
  icon_url?: string;
  created_at: string;
  updated_at: string;
}

// Maps 타입
export interface Map {
  id: number;
  ids: number;
  name: string;
  description: string;
  level: number;
  monsters: number[];
  rewards: Record<string, unknown>;
  icon_url?: string;
  created_at: string;
  updated_at: string;
}

// Dashboard 통계 타입
export interface DashboardStats {
  attributes: number;
  buffs: number;
  items: number;
  monsters: number;
  skills: number;
  jobs: number;
  maps: number;
  achievements: number;
  total: number;
  version?: string;
}

// 쿼리 파라미터 타입
export interface QueryParams {
  [key: string]: string | number | boolean | undefined;
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
  minLevel?: number;
  maxLevel?: number;
  id?: number;
  ids?: string;
  job_id?: number;
}
