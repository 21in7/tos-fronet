'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ChallengeData {
    day: number;
    mapName: string;
    mapImage?: string;
}

const WEEKS = ['일', '월', '화', '수', '목', '금', '토'];



export default function ChallengeCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [challengeData, setChallengeData] = useState<ChallengeData[]>([]);
    const [selectedMap, setSelectedMap] = useState<ChallengeData | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // 1-12

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const response = await import('@/lib/api').then(m => m.challengeModeAutoMapsApi.getAll());

                if (!response.success || !Array.isArray(response.data)) {
                    throw new Error('Failed to fetch challenges');
                }

                const allMaps = response.data;
                const isEvenMonth = month % 2 === 0;

                // Filter and map based on month (Odd=OM=1~31, Even=EM=32~62)
                const mappedItems: ChallengeData[] = allMaps
                    .filter(map => {
                        if (isEvenMonth) {
                            return map.id >= 32 && map.id <= 62;
                        } else {
                            return map.id >= 1 && map.id <= 31;
                        }
                    })
                    .map(map => {
                        const baseUrl = isEvenMonth
                            ? 'https://r2.gihyeonofsoul.com/em/'
                            : 'https://r2.gihyeonofsoul.com/om/';

                        // Calculate day
                        const day = isEvenMonth ? map.id - 31 : map.id;

                        // Use icon from API if available, otherwise try to construct from name or provide fallback
                        // The user mentioned images are in R2 bucket under em/om
                        // Assuming API 'icon' field or 'icon_url' might contain the filename or we can use the map name
                        // For now, let's look at the 'icon' field from the new API. 
                        // If the previous API 'image' field corresponded to a filename, we hope 'icon' does too.
                        const imageName = map.icon || '';

                        return {
                            day,
                            mapName: map.name,
                            mapImage: imageName ? `${baseUrl}${imageName}` : undefined
                        };
                    });

                setChallengeData(mappedItems);
            } catch (error) {
                console.error('Error fetching challenges:', error);
                setChallengeData([]);
            }
        };

        fetchChallenges();
    }, [month]);

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month - 1, 1).getDay();
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 2, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month, 1));
    };

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];
    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const getMapForDay = (day: number) => {
        return challengeData.find(d => d.day === day);
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {year}년 {month}월 챌린지
                </h2>
                <div className="flex space-x-2">
                    <button
                        onClick={handlePrevMonth}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleNextMonth}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                {WEEKS.map((day) => (
                    <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-500">
                        {day}
                    </div>
                ))}
                {days.map((day, index) => {
                    const mapInfo = day ? getMapForDay(day) : null;
                    return (
                        <div
                            key={index}
                            className={`bg-white min-h-[100px] p-2 hover:bg-gray-50 transition-colors relative ${!day ? 'bg-gray-50' : ''
                                }`}
                        >
                            {day && (
                                <>
                                    <span className="text-sm font-medium text-gray-900">{day}</span>
                                    {mapInfo ? (
                                        <button
                                            onClick={() => setSelectedMap(mapInfo)}
                                            className="mt-1 w-full text-left"
                                        >
                                            <div className="text-xs text-indigo-600 font-medium hover:underline break-words line-clamp-2">
                                                {mapInfo.mapName.split(',')[0]}
                                            </div>
                                        </button>
                                    ) : (
                                        <div className="text-xs text-gray-400 mt-1">정보 없음</div>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Map Image Modal */}
            {selectedMap && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={() => setSelectedMap(null)}>
                    <div className="bg-white rounded-lg max-w-4xl w-full p-4 relative" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900 pr-8">{selectedMap.mapName}</h3>
                            <button
                                onClick={() => setSelectedMap(null)}
                                className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="relative aspect-video w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                            {selectedMap.mapImage ? (
                                <Image
                                    src={selectedMap.mapImage}
                                    alt={selectedMap.mapName}
                                    fill
                                    className="object-contain"
                                    unoptimized // Assuming external images or untrusted optimization
                                />
                            ) : (
                                <div className="text-gray-500">이미지가 없습니다</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
