import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Resume, JobDescription, MatchScore, ResumeSection, ResumeItem } from '@/types/resume';
import { v4 as uuidv4 } from 'uuid'; // We might need to handle IDs manually if uuid isn't available or just use crypto.randomUUID

// Simple ID generator if we don't want to add uuid dependency just for this
const generateId = () => Math.random().toString(36).substring(2, 9);

interface AppState {
    // Resume State
    currentResume: Resume | null;
    savedResumes: Resume[];

    // JD State
    currentJD: JobDescription | null;

    // Analysis State
    matchScore: MatchScore | null;
    isAnalyzing: boolean;

    // Actions
    setResume: (resume: Resume) => void;
    updateResumeSection: (sectionId: string, items: ResumeItem[]) => void;
    updatePersonalInfo: (info: Resume['personalInfo']) => void;
    saveResume: () => void; // Saves current to saved list
    loadResume: (id: string) => void;
    createNewResume: () => void;

    setJobDescription: (jd: JobDescription) => void;
    setMatchScore: (score: MatchScore) => void;
    setIsAnalyzing: (isAnalyzing: boolean) => void;
}

const initialResume: Resume = {
    id: 'default',
    title: 'My Resume',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    personalInfo: {
        fullName: '',
        email: '',
        phone: '',
    },
    design: {
        font: 'inter',
        accentColor: '#000000',
        spacing: 1.0,
        margins: 20,
        entryLayout: 'right'
    },
    sections: [
        { id: 'summary', title: 'Professional Summary', type: 'summary', items: [] },
        { id: 'experience', title: 'Work Experience', type: 'experience', items: [] },
        { id: 'skills', title: 'Skills', type: 'skills', items: [], columns: 2 },
        { id: 'projects', title: 'Projects', type: 'projects', items: [] },
        { id: 'education', title: 'Education', type: 'education', items: [] },
    ],
};

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            currentResume: initialResume,
            savedResumes: [],
            currentJD: null,
            matchScore: null,
            isAnalyzing: false,

            setResume: (resume) => set({ currentResume: resume }),

            updateResumeSection: (sectionId, items) =>
                set((state) => {
                    if (!state.currentResume) return state;
                    const newSections = state.currentResume.sections.map((sec) =>
                        sec.id === sectionId ? { ...sec, items } : sec
                    );
                    return {
                        currentResume: { ...state.currentResume, sections: newSections, updatedAt: Date.now() }
                    };
                }),

            updatePersonalInfo: (info) =>
                set((state) => {
                    if (!state.currentResume) return state;
                    return {
                        currentResume: { ...state.currentResume, personalInfo: info, updatedAt: Date.now() }
                    };
                }),

            saveResume: () =>
                set((state) => {
                    if (!state.currentResume) return state;
                    const exists = state.savedResumes.find(r => r.id === state.currentResume?.id);
                    let newSaved;
                    if (exists) {
                        newSaved = state.savedResumes.map(r => r.id === state.currentResume?.id ? state.currentResume! : r);
                    } else {
                        newSaved = [...state.savedResumes, state.currentResume];
                    }
                    return { savedResumes: newSaved };
                }),

            loadResume: (id) =>
                set((state) => {
                    const resume = state.savedResumes.find(r => r.id === id);
                    return resume ? { currentResume: resume } : state;
                }),

            createNewResume: () =>
                set({
                    currentResume: { ...initialResume, id: generateId(), createdAt: Date.now() }
                }),

            setJobDescription: (jd) => set({ currentJD: jd }),
            setMatchScore: (score) => set({ matchScore: score }),
            setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
        }),
        {
            name: 'skillsync-storage',
            storage: createJSONStorage(() => localStorage),
            version: 1,
            migrate: (persistedState: any, version: number) => {
                if (version === 0) {
                    // Migration from v0 to v1: Add design object
                    const state = persistedState as AppState;
                    if (state.currentResume && !state.currentResume.design) {
                        state.currentResume.design = {
                            font: 'inter',
                            accentColor: '#000000',
                            spacing: 1.0,
                            margins: 20,
                            entryLayout: 'right'
                        };
                    }
                    if (state.savedResumes) {
                        state.savedResumes = state.savedResumes.map(r => {
                            if (!r.design) {
                                return {
                                    ...r,
                                    design: {
                                        font: 'inter',
                                        accentColor: '#000000',
                                        spacing: 1.0,
                                        margins: 20,
                                        entryLayout: 'right'
                                    }
                                };
                            }
                            return r;
                        });
                    }
                }
                return persistedState;
            },
        }
    )
);
