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
  ids: number;
  name: string;
  description: string;
  type: 'strength' | 'agility' | 'intelligence' | 'vitality' | 'luck';
  base_value: number;
  max_value: number;
  created_at: string;
  updated_at: string;
}

// Items 타입
export interface Item {
  id: number;
  ids: number;
  name: string;
  description: string;
  descriptions?: string;
  type: string;
  rarity: string;
  level: number;
  stats?: Record<string, any>;
  price?: number;
  stackable?: boolean;
  weight?: number;
  icon_url?: string;
  created_at: string;
  updated_at: string;
}

// Monsters 타입
export interface Monster {
  id: number;
  ids: number;
  name: string;
  description: string;
  level: number;
  hp?: number;
  exp?: number;
  exp_class?: number;
  race?: string;
  rank?: string;
  size?: string;
  element?: string;
  patk_min?: number;
  patk_max?: number;
  matk_min?: number;
  matk_max?: number;
  pdef?: number;
  mdef?: number;
  accuracy?: number;
  eva?: number;
  critrate?: number;
  block?: number;
  stat_str?: number;
  stat_con?: number;
  stat_int?: number;
  stat_spr?: number;
  stat_dex?: number;
  icon_url?: string;
  created_at: string;
  updated_at: string;
}

// Skills 타입
export interface Skill {
  id: number;
  ids: number;
  name: string;
  description: string;
  type?: string;
  level?: number;
  cooldown?: number;
  cost?: number;
  mana_cost?: number;
  damage?: number;
  range?: number;
  element?: string;
  effects?: Record<string, any>;
  requirements?: Record<string, any>;
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
  requirements?: Record<string, any>;
  bonuses?: Record<string, any>;
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
  rewards: Record<string, any>;
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
}

// 쿼리 파라미터 타입
export interface QueryParams {
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
