import { ChallengeModeAutoMap } from '@/types/api';
import GameImage from '@/components/common/GameImage';


interface ChallengeMapListProps {
    maps: ChallengeModeAutoMap[];
    loading: boolean;
}

export default function ChallengeMapList({ maps, loading }: ChallengeMapListProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-gray-800 rounded-lg p-4 h-32 animate-pulse" />
                ))}
            </div>
        );
    }

    if (maps.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400 bg-gray-800/30 rounded-lg">
                검색 결과가 없습니다.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {maps.map((map) => (
                <div
                    key={map.id}
                    className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition-colors group"
                >
                    <div className="p-4 flex gap-4">
                        <div className="flex-shrink-0">
                            <GameImage
                                src={map.icon || map.icon_url}
                                alt={map.name}
                                width={64}
                                height={64}
                                className="rounded-md"
                                type="map"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-white mb-1 truncate group-hover:text-blue-400">
                                {map.name}
                            </h3>
                            {map.map_name && (
                                <p className="text-sm text-gray-400 truncate mb-1">
                                    {map.map_name}
                                </p>
                            )}
                            <div className="flex flex-wrap gap-2 text-xs">
                                {(map.min_level || map.max_level) && (
                                    <span className="px-2 py-0.5 bg-gray-700/50 rounded text-gray-300">
                                        Lv. {map.min_level || 1} ~ {map.max_level || '???'}
                                    </span>
                                )}
                                {map.recommend_party_player_count && (
                                    <span className="px-2 py-0.5 bg-blue-900/30 text-blue-300 rounded">
                                        {map.recommend_party_player_count}인
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
