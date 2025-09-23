-- Tavern of Soul 데이터베이스 테이블 생성 스크립트
-- 사용법: MySQL/MariaDB에서 이 스크립트를 실행하세요

-- Attributes 테이블
CREATE TABLE IF NOT EXISTS attributes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  type ENUM('strength', 'agility', 'intelligence', 'vitality', 'luck') NOT NULL,
  base_value INT DEFAULT 0,
  max_value INT DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Items 테이블
CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  type ENUM('weapon', 'armor', 'accessory', 'consumable', 'material') NOT NULL,
  rarity ENUM('common', 'uncommon', 'rare', 'epic', 'legendary') DEFAULT 'common',
  level INT DEFAULT 1,
  stats JSON,
  price INT DEFAULT 0,
  stackable BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Monsters 테이블
CREATE TABLE IF NOT EXISTS monsters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  level INT DEFAULT 1,
  hp INT DEFAULT 100,
  attack INT DEFAULT 10,
  defense INT DEFAULT 5,
  speed INT DEFAULT 10,
  experience INT DEFAULT 10,
  loot_table JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Skills 테이블
CREATE TABLE IF NOT EXISTS skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  type ENUM('active', 'passive') NOT NULL,
  level INT DEFAULT 1,
  cooldown INT DEFAULT 0,
  mana_cost INT DEFAULT 0,
  damage INT DEFAULT 0,
  effects JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Jobs 테이블
CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  requirements JSON,
  bonuses JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Maps 테이블
CREATE TABLE IF NOT EXISTS maps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  level INT DEFAULT 1,
  monsters JSON,
  rewards JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 샘플 데이터 삽입
INSERT INTO attributes (name, description, type, base_value, max_value) VALUES
('힘', '물리 공격력과 관련된 능력치', 'strength', 10, 100),
('민첩', '공격 속도와 회피율에 영향', 'agility', 10, 100),
('지능', '마법 공격력과 마나량 결정', 'intelligence', 10, 100),
('체력', '생명력과 방어력에 관련', 'vitality', 10, 100),
('운', '크리티컬과 아이템 드롭률 영향', 'luck', 10, 100);

INSERT INTO items (name, description, type, rarity, level, price) VALUES
('초보자 검', '새로운 모험가를 위한 기본 검', 'weapon', 'common', 1, 100),
('가죽 갑옷', '기본적인 보호를 제공하는 갑옷', 'armor', 'common', 1, 150),
('체력 포션', '체력을 회복시키는 물약', 'consumable', 'common', 1, 50);

INSERT INTO monsters (name, description, level, hp, attack, defense, experience) VALUES
('슬라임', '젤리 같은 몸체를 가진 약한 몬스터', 1, 50, 5, 2, 10),
('고블린', '작지만 교활한 녹색 피부의 몬스터', 3, 80, 12, 5, 25),
('오크', '강력한 근력을 자랑하는 대형 몬스터', 5, 150, 20, 10, 50);

INSERT INTO skills (name, description, type, level, cooldown, mana_cost, damage) VALUES
('베기', '검으로 적을 베는 기본 공격', 'active', 1, 0, 0, 15),
('파이어볼', '불덩이를 날려 적을 공격', 'active', 1, 3, 10, 25),
('힘 증가', '물리 공격력을 영구적으로 증가', 'passive', 1, 0, 0, 0);

INSERT INTO jobs (name, description, requirements, bonuses) VALUES
('전사', '근접 전투에 특화된 직업', '{"strength": 15}', '{"attack": 10, "defense": 5}'),
('마법사', '마법 공격에 특화된 직업', '{"intelligence": 15}', '{"magic_attack": 15, "mana": 20}'),
('도적', '빠른 공격과 회피에 특화', '{"agility": 15}', '{"speed": 10, "critical": 5}');

INSERT INTO maps (name, description, level, monsters, rewards) VALUES
('초보자 숲', '새로운 모험가들이 처음 탐험하는 숲', 1, '[1, 2]', '{"experience": 50, "gold": 100}'),
('고블린 동굴', '고블린들이 서식하는 어두운 동굴', 3, '[2, 3]', '{"experience": 150, "gold": 300}'),
('오크 요새', '오크들의 강력한 요새', 5, '[3]', '{"experience": 300, "gold": 500}');
