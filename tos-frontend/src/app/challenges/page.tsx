import ChallengeCalendar from '@/components/challenges/ChallengeCalendar';

export const metadata = {
    title: '챌린지 캘린더 | Tavern of Soul',
    description: '매일매일 변경되는 챌린지 맵 정보를 확인하세요.',
};

export default function ChallengesPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">챌린지 맵 캘린더</h1>
                <p className="mt-2 text-gray-600">
                    날짜별 챌린지 맵 정보를 확인할 수 있습니다.
                </p>
            </div>
            <ChallengeCalendar />
        </div>
    );
}
