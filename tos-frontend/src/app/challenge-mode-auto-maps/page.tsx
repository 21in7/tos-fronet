'use client';

import { useState, useEffect, useCallback } from 'react';
import { challengeModeAutoMapsApi } from '@/lib/api';
import { ChallengeModeAutoMap, QueryParams } from '@/types/api';
import ChallengeMapList from '@/components/challenge-mode/ChallengeMapList';

export default function ChallengeModeAutoMapsPage() {
    const [maps, setMaps] = useState<ChallengeModeAutoMap[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Debounce search term
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    const [jobs, setJobs] = useState<{ id: number; name: string }[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<number | undefined>(undefined);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        // Fetch jobs for filter
        const fetchJobs = async () => {
            try {
                const response = await import('@/lib/api').then(m => m.jobsApi.getAll());
                if (response.success && Array.isArray(response.data)) {
                    // Filter base jobs or meaningful jobs if needed, but for now take all or sorted
                    const sortedJobs = response.data.sort((a: any, b: any) => a.name.localeCompare(b.name));
                    setJobs(sortedJobs);
                }
            } catch (error) {
                console.error('Failed to fetch jobs:', error);
            }
        };
        fetchJobs();
    }, []);

    const fetchMaps = useCallback(async () => {
        setLoading(true);
        try {
            const params: QueryParams = {};

            if (debouncedSearchTerm) {
                params.search = debouncedSearchTerm;
            }

            if (selectedClassId) {
                params.class_id = selectedClassId;
            }

            const response = await challengeModeAutoMapsApi.getAll(params);

            if (response.success && Array.isArray(response.data)) {
                setMaps(response.data);
            } else {
                setMaps([]);
            }
        } catch (error) {
            console.error('Failed to fetch challenge mode auto maps:', error);
            setMaps([]);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearchTerm, selectedClassId]);

    useEffect(() => {
        fetchMaps();
    }, [fetchMaps]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4 text-white">챌린지 모드 자동 맵</h1>
                <p className="text-gray-400 mb-6">
                    챌린지 모드 자동 매칭이 가능한 맵 목록입니다.
                </p>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="맵 이름 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-500"
                        />
                    </div>
                    <div className="w-full md:w-64">
                        <select
                            value={selectedClassId || ''}
                            onChange={(e) => setSelectedClassId(e.target.value ? Number(e.target.value) : undefined)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white appearance-none"
                        >
                            <option value="">모든 직업</option>
                            {jobs.map((job) => (
                                <option key={job.id} value={job.id}>
                                    {job.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <ChallengeMapList maps={maps} loading={loading} />
        </div>
    );
}
