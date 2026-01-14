// 일본어 번역 파일 (jtos)
import type { TranslationKeys } from './ko';

export const ja: TranslationKeys = {
    // 공통
    common: {
        loading: '読み込み中...',
        error: 'エラーが発生しました',
        noData: 'データがありません',
        search: '検索',
        filter: 'フィルター',
        all: 'すべて',
        reset: 'リセット',
        save: '保存',
        cancel: 'キャンセル',
        confirm: '確認',
        close: '閉じる',
        copy: 'コピー',
        share: '共有',
        more: 'もっと見る',
        back: '戻る',
        next: '次へ',
        prev: '前へ',
    },

    // 네비게이션
    nav: {
        dashboard: 'ダッシュボード',
        attributes: '特性',
        buffs: 'バフ',
        items: 'アイテム',
        monsters: 'モンスター',
        skills: 'スキル',
        jobs: '職業',
        maps: 'マップ',
        challenges: 'チャレンジ',
        planner: 'プランナー',
        simulator: 'シミュレーター',
        archeology: '考古学',
        reinforce: '装備強化',
        gearscore: 'ギアスコア',
        openMenu: 'メニューを開く',
    },

    // 헤더
    header: {
        title: 'ツリーオブセイヴァー',
        titleShort: 'ToS',
        selectVersion: 'バージョン選択',
    },

    // 대시보드
    dashboard: {
        title: 'ダッシュボード',
        stats: {
            jobs: '職業',
            skills: 'スキル',
            items: 'アイテム',
            monsters: 'モンスター',
            attributes: '特性',
            maps: 'マップ',
            buffs: 'バフ',
            challenges: 'チャレンジ',
        },
        sections: {
            recentJobs: '最近追加された職業',
            recentSkills: '最近追加されたスキル',
            recentItems: '最近追加されたアイテム',
        },
        gameVersion: 'ゲームバージョン',
        apiStatus: 'API状態',
        online: 'オンライン',
        offline: 'オフライン',
    },

    // 플래너
    planner: {
        title: 'キャラクタービルドプランナー',
        selectClass: 'クラス選択',
        skillPoints: 'スキルポイント',
        remaining: '残りポイント',
        used: '使用ポイント',
        resetAll: 'すべてリセット',
        shareLink: '共有リンク',
        linkCopied: 'リンクがコピーされました！',
        selectJob: '職業を選択してください',
        noSkills: 'スキルがありません',
        jobSlot: '職業スロット',
        emptySlot: '空きスロット',
    },

    // 시뮬레이터
    simulator: {
        archeology: {
            title: '考古学シミュレーター',
            extract: '発掘',
            results: '結果',
            totalAttempts: '総試行回数',
            successRate: '成功率',
        },
        reinforce: {
            title: '装備強化シミュレーター',
            currentLevel: '現在の強化レベル',
            targetLevel: '目標レベル',
            enhance: '強化する',
            success: '成功',
            fail: '失敗',
            destroy: '破壊',
        },
        gearscore: {
            title: 'ギアスコア計算機',
            totalScore: '合計スコア',
            equipment: '装備',
            calculate: '計算する',
        },
    },

    // 직업
    jobs: {
        title: '職業リスト',
        baseClass: '基本クラス',
        rank: 'ランク',
        type: 'タイプ',
        searchPlaceholder: '職業名で検索...',
    },

    // 스킬
    skills: {
        title: 'スキルリスト',
        level: 'レベル',
        type: 'タイプ',
        cooldown: 'クールダウン',
        spCost: 'SP消費量',
        searchPlaceholder: 'スキル名で検索...',
    },

    // 아이템
    items: {
        title: 'アイテムリスト',
        type: '種類',
        grade: '等級',
        level: 'レベル',
        searchPlaceholder: 'アイテム名で検索...',
    },

    // 몬스터
    monsters: {
        title: 'モンスターリスト',
        level: 'レベル',
        type: 'タイプ',
        searchPlaceholder: 'モンスター名で検索...',
    },

    // 특성
    attributes: {
        title: '特性リスト',
        maxLevel: '最大レベル',
        cost: 'コスト',
        searchPlaceholder: '特性名で検索...',
    },

    // 맵
    maps: {
        title: 'マップリスト',
        level: 'レベル',
        type: 'タイプ',
        searchPlaceholder: 'マップ名で検索...',
    },

    // 버프
    buffs: {
        title: 'バフリスト',
        duration: '持続時間',
        searchPlaceholder: 'バフ名で検索...',
    },

    // 챌린지
    challenges: {
        title: 'チャレンジリスト',
        difficulty: '難易度',
        rewards: '報酬',
        searchPlaceholder: 'チャレンジ名で検索...',
    },
};
