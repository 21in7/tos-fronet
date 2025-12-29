import { create } from 'zustand';
import { Job } from '@/types/api';

export interface PlannerState {
    selectedJobs: (Job | null)[]; // Fixed size 4: [Base, Sub1, Sub2, Sub3]
    skillAllocations: Record<number, Record<number, number>>; // jobId -> skillId -> level

    // Actions
    setJob: (index: number, job: Job) => void;
    removeJob: (index: number) => void;
    updateSkillLevel: (jobId: number, skillId: number, level: number) => void;
    resetAll: () => void;

    // Computed helpers could be here or derived in components
    getAllocatedSp: (jobId: number) => number;
}

export const usePlannerStore = create<PlannerState>((set, get) => ({
    selectedJobs: [null, null, null, null],
    skillAllocations: {},

    setJob: (index, job) => {
        set((state) => {
            const newJobs = [...state.selectedJobs];

            // If changing a slot, remove all subsequent slots
            for (let i = index; i < 4; i++) {
                newJobs[i] = null;
            }
            newJobs[index] = job;

            // Also clean up skill allocations for removed jobs
            const newAllocations = { ...state.skillAllocations };
            // Note: In a real app we might want to keep allocations if we re-select the same job,
            // but for simplicity/correctness with "resetting subsequent slots", let's clear them 
            // if the job actually changed.
            // Ideally we should verify if the job ID actually changed.

            // For now, if we are setting a job, we initialize its allocation bucket if needed
            if (!newAllocations[job.id]) {
                newAllocations[job.id] = {};
            }

            return { selectedJobs: newJobs, skillAllocations: newAllocations };
        });
    },

    removeJob: (index) => {
        set((state) => {
            const newJobs = [...state.selectedJobs];
            // Remove this and all subsequent jobs
            for (let i = index; i < 4; i++) {
                const job = newJobs[i];
                if (job) {
                    // We could optionally clear allocations here
                }
                newJobs[i] = null;
            }
            return { selectedJobs: newJobs };
        });
    },

    updateSkillLevel: (jobId, skillId, level) => {
        set((state) => {
            const jobAllocations = { ...(state.skillAllocations[jobId] || {}) };
            jobAllocations[skillId] = level;

            return {
                skillAllocations: {
                    ...state.skillAllocations,
                    [jobId]: jobAllocations
                }
            };
        });
    },

    resetAll: () => {
        set({
            selectedJobs: [null, null, null, null],
            skillAllocations: {}
        });
    },

    getAllocatedSp: (jobId) => {
        const state = get();
        const allocations = state.skillAllocations[jobId];
        if (!allocations) return 0;
        return Object.values(allocations).reduce((sum, lvl) => sum + lvl, 0);
    }
}));
