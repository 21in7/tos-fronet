'use client';

import { useState } from 'react';
import { usePlannerStore } from '@/store/usePlannerStore';
import { Plus, X, ChevronRight } from 'lucide-react';
import GameImage from '@/components/common/GameImage';
import JobSelectionModal from './JobSelectionModal';

export default function ClassSelector() {
    const { selectedJobs, setJob, removeJob } = usePlannerStore();
    const [modalOpen, setModalOpen] = useState(false);
    const [activeSlot, setActiveSlot] = useState<number | null>(null);

    const handleSlotClick = (index: number) => {
        // Prevent skipping slots
        // Slot 0 (Base) always allowed
        // Slot 1 requires Slot 0
        // Slot 2 requires Slot 1, etc.
        if (index > 0 && !selectedJobs[index - 1]) {
            return;
        }

        setActiveSlot(index);
        setModalOpen(true);
    };

    const handleJobSelect = (job: import('@/types/api').Job) => {
        if (activeSlot !== null) {
            setJob(activeSlot, job);
            setModalOpen(false);
            setActiveSlot(null);
        }
    };

    const handleRemove = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        removeJob(index);
    };

    return (
        <>
            <div className="flex items-center gap-2 sm:gap-4 bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
                {selectedJobs.map((job, index) => (
                    <div key={index} className="flex items-center">
                        {/* Slot */}
                        <div
                            onClick={() => handleSlotClick(index)}
                            className={`
                relative flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-xl border-2 transition-all cursor-pointer flex-shrink-0
                ${job
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : (index === 0 || selectedJobs[index - 1])
                                        ? 'border-dashed border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                                        : 'border-dashed border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                                }
              `}
                        >
                            {job ? (
                                <>
                                    <GameImage
                                        src={job.icon_url}
                                        alt={job.name}
                                        width={40}
                                        height={40}
                                        type="job"
                                        className="w-8 h-8 sm:w-12 sm:h-12"
                                    />

                                    {/* Remove Button - Only if not base? Or allowed? Let's allow but it resets all */}
                                    <button
                                        onClick={(e) => handleRemove(e, index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>

                                    <div className="absolute -bottom-6 sm:-bottom-8 text-xs font-medium text-gray-700 whitespace-nowrap text-center w-16 sm:w-32 truncate">
                                        {job.name}
                                    </div>
                                </>
                            ) : (
                                <Plus className={`w-8 h-8 ${(index === 0 || selectedJobs[index - 1]) ? 'text-gray-400' : 'text-gray-300'
                                    }`} />
                            )}
                        </div>

                        {/* Separator - hide on mobile */}
                        {index < 3 && (
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 ml-1 sm:ml-4 hidden sm:block flex-shrink-0" />
                        )}
                    </div>
                ))}
            </div>

            {activeSlot !== null && (
                <JobSelectionModal
                    isOpen={modalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        setActiveSlot(null);
                    }}
                    onSelect={handleJobSelect}
                    slotIndex={activeSlot}
                    baseJob={selectedJobs[0]}
                />
            )}
        </>
    );
}
