// 영어 번역 파일 (itos)
import type { TranslationKeys } from './ko';

export const en: TranslationKeys = {
    // 공통
    common: {
        loading: 'Loading...',
        error: 'An error occurred',
        noData: 'No data available',
        search: 'Search',
        filter: 'Filter',
        all: 'All',
        reset: 'Reset',
        save: 'Save',
        cancel: 'Cancel',
        confirm: 'Confirm',
        close: 'Close',
        copy: 'Copy',
        share: 'Share',
        more: 'More',
        back: 'Back',
        next: 'Next',
        prev: 'Previous',
    },

    // 네비게이션
    nav: {
        dashboard: 'Dashboard',
        attributes: 'Attributes',
        buffs: 'Buffs',
        items: 'Items',
        monsters: 'Monsters',
        skills: 'Skills',
        jobs: 'Classes',
        maps: 'Maps',
        challenges: 'Challenges',
        planner: 'Planner',
        simulator: 'Simulator',
        archeology: 'Archeology',
        reinforce: 'Enhancement',
        gearscore: 'Gear Score',
        openMenu: 'Open menu',
    },

    // 헤더
    header: {
        title: 'Tree of Savior',
        titleShort: 'ToS',
        selectVersion: 'Select Version',
    },

    // 대시보드
    dashboard: {
        title: 'Dashboard',
        stats: {
            jobs: 'Classes',
            skills: 'Skills',
            items: 'Items',
            monsters: 'Monsters',
            attributes: 'Attributes',
            maps: 'Maps',
            buffs: 'Buffs',
            challenges: 'Challenges',
        },
        sections: {
            recentJobs: 'Recently Added Classes',
            recentSkills: 'Recently Added Skills',
            recentItems: 'Recently Added Items',
        },
        gameVersion: 'Game Version',
        apiStatus: 'API Status',
        online: 'Online',
        offline: 'Offline',
    },

    // 플래너
    planner: {
        title: 'Character Build Planner',
        selectClass: 'Select Class',
        skillPoints: 'Skill Points',
        remaining: 'Remaining',
        used: 'Used',
        resetAll: 'Reset All',
        shareLink: 'Share Link',
        linkCopied: 'Link copied!',
        selectJob: 'Select a class',
        noSkills: 'No skills available',
        jobSlot: 'Class Slot',
        emptySlot: 'Empty Slot',
    },

    // 시뮬레이터
    simulator: {
        archeology: {
            title: 'Archeology Simulator',
            extract: 'Extract',
            results: 'Results',
            totalAttempts: 'Total Attempts',
            successRate: 'Success Rate',
        },
        reinforce: {
            title: 'Enhancement Simulator',
            currentLevel: 'Current Level',
            targetLevel: 'Target Level',
            enhance: 'Enhance',
            success: 'Success',
            fail: 'Failed',
            destroy: 'Destroyed',
        },
        gearscore: {
            title: 'Gear Score Calculator',
            totalScore: 'Total Score',
            equipment: 'Equipment',
            calculate: 'Calculate',
        },
    },

    // 직업
    jobs: {
        title: 'Class List',
        baseClass: 'Base Class',
        rank: 'Rank',
        type: 'Type',
        searchPlaceholder: 'Search by class name...',
    },

    // 스킬
    skills: {
        title: 'Skill List',
        level: 'Level',
        type: 'Type',
        cooldown: 'Cooldown',
        spCost: 'SP Cost',
        searchPlaceholder: 'Search by skill name...',
    },

    // 아이템
    items: {
        title: 'Item List',
        type: 'Type',
        grade: 'Grade',
        level: 'Level',
        searchPlaceholder: 'Search by item name...',
    },

    // 몬스터
    monsters: {
        title: 'Monster List',
        level: 'Level',
        type: 'Type',
        searchPlaceholder: 'Search by monster name...',
    },

    // 특성
    attributes: {
        title: 'Attribute List',
        maxLevel: 'Max Level',
        cost: 'Cost',
        searchPlaceholder: 'Search by attribute name...',
    },

    // 맵
    maps: {
        title: 'Map List',
        level: 'Level',
        type: 'Type',
        searchPlaceholder: 'Search by map name...',
    },

    // 버프
    buffs: {
        title: 'Buff List',
        duration: 'Duration',
        searchPlaceholder: 'Search by buff name...',
    },

    // 챌린지
    challenges: {
        title: 'Challenge List',
        difficulty: 'Difficulty',
        rewards: 'Rewards',
        searchPlaceholder: 'Search by challenge name...',
    },
};
