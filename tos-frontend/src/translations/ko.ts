// 한국어 번역 파일 (ktos)
export const ko = {
    // 공통
    common: {
        loading: '로딩 중...',
        error: '오류가 발생했습니다',
        noData: '데이터가 없습니다',
        search: '검색',
        filter: '필터',
        all: '전체',
        reset: '초기화',
        save: '저장',
        cancel: '취소',
        confirm: '확인',
        close: '닫기',
        copy: '복사',
        share: '공유하기',
        more: '더보기',
        back: '뒤로',
        next: '다음',
        prev: '이전',
    },

    // 네비게이션
    nav: {
        dashboard: '대시보드',
        attributes: '특성',
        buffs: '버프',
        items: '아이템',
        monsters: '몬스터',
        skills: '스킬',
        jobs: '직업',
        maps: '맵',
        challenges: '챌린지',
        planner: '플래너',
        simulator: '시뮬레이터',
        archeology: '고고학 옵션',
        reinforce: '장비 강화',
        gearscore: '기어스코어',
        openMenu: '메뉴 열기',
    },

    // 헤더
    header: {
        title: '트리오브세이비어',
        titleShort: 'ToS',
        selectVersion: '버전 선택',
    },

    // 대시보드
    dashboard: {
        title: '대시보드',
        stats: {
            jobs: '직업',
            skills: '스킬',
            items: '아이템',
            monsters: '몬스터',
            attributes: '특성',
            maps: '맵',
            buffs: '버프',
            challenges: '챌린지',
        },
        sections: {
            recentJobs: '최근 추가된 직업',
            recentSkills: '최근 추가된 스킬',
            recentItems: '최근 추가된 아이템',
        },
        gameVersion: '게임 버전',
        apiStatus: 'API 상태',
        online: '온라인',
        offline: '오프라인',
    },

    // 플래너
    planner: {
        title: '캐릭터 빌드 플래너',
        selectClass: '클래스 선택',
        skillPoints: '스킬 포인트',
        remaining: '남은 포인트',
        used: '사용한 포인트',
        resetAll: '전체 초기화',
        shareLink: '공유 링크',
        linkCopied: '링크가 복사되었습니다!',
        selectJob: '직업을 선택하세요',
        noSkills: '스킬이 없습니다',
        jobSlot: '직업 슬롯',
        emptySlot: '빈 슬롯',
    },

    // 시뮬레이터
    simulator: {
        archeology: {
            title: '고고학 옵션 시뮬레이터',
            extract: '발굴하기',
            results: '결과',
            totalAttempts: '총 시도 횟수',
            successRate: '성공률',
        },
        reinforce: {
            title: '장비 강화 시뮬레이터',
            currentLevel: '현재 강화 레벨',
            targetLevel: '목표 레벨',
            enhance: '강화하기',
            success: '성공',
            fail: '실패',
            destroy: '파괴',
        },
        gearscore: {
            title: '기어스코어 계산기',
            totalScore: '총 점수',
            equipment: '장비',
            calculate: '계산하기',
        },
    },

    // 직업
    jobs: {
        title: '직업 목록',
        baseClass: '기본 클래스',
        rank: '랭크',
        type: '타입',
        searchPlaceholder: '직업 이름으로 검색...',
    },

    // 스킬
    skills: {
        title: '스킬 목록',
        level: '레벨',
        type: '타입',
        cooldown: '쿨다운',
        spCost: 'SP 소모량',
        searchPlaceholder: '스킬 이름으로 검색...',
    },

    // 아이템
    items: {
        title: '아이템 목록',
        type: '종류',
        grade: '등급',
        level: '레벨',
        searchPlaceholder: '아이템 이름으로 검색...',
    },

    // 몬스터
    monsters: {
        title: '몬스터 목록',
        level: '레벨',
        type: '타입',
        searchPlaceholder: '몬스터 이름으로 검색...',
    },

    // 특성
    attributes: {
        title: '특성 목록',
        maxLevel: '최대 레벨',
        cost: '비용',
        searchPlaceholder: '특성 이름으로 검색...',
    },

    // 맵
    maps: {
        title: '맵 목록',
        level: '레벨',
        type: '타입',
        searchPlaceholder: '맵 이름으로 검색...',
    },

    // 버프
    buffs: {
        title: '버프 목록',
        duration: '지속시간',
        searchPlaceholder: '버프 이름으로 검색...',
    },

    // 챌린지
    challenges: {
        title: '챌린지 목록',
        difficulty: '난이도',
        rewards: '보상',
        searchPlaceholder: '챌린지 이름으로 검색...',
    },
};

export type TranslationKeys = typeof ko;
