import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { StudyTemplate, StudyResult, OutputGroup } from '@/domain/model';
import { generateChecksum } from '@/domain/checksum';

type RunStep = 'upload' | 'participant' | 'sorting' | 'review';

interface CardPlacement {
  cardId: string;
  categoryId: string | null; // null means unsorted
  isUnsure: boolean;
}

interface RunState {
  step: RunStep;
  template: StudyTemplate | null;
  templateChecksum: string | null;
  participantName: string;
  cardPlacements: CardPlacement[];
  startedAt: string | null;
  movesCount: number;
  undoCount: number;
  undoStack: CardPlacement[][];
  
  // Actions
  setStep: (step: RunStep) => void;
  setTemplate: (template: StudyTemplate) => Promise<void>;
  setParticipantName: (name: string) => void;
  startSession: () => void;
  moveCard: (cardId: string, categoryId: string | null, isUnsure?: boolean) => void;
  undo: () => void;
  reset: () => void;
  generateResult: () => Promise<StudyResult>;
  
  // Computed getters
  getUnsortedCards: () => string[];
  getSortedCards: () => OutputGroup[];
  getUnsureCards: () => string[];
  getProgress: () => { sorted: number; total: number };
}

const initialState = {
  step: 'upload' as RunStep,
  template: null as StudyTemplate | null,
  templateChecksum: null as string | null,
  participantName: '',
  cardPlacements: [] as CardPlacement[],
  startedAt: null as string | null,
  movesCount: 0,
  undoCount: 0,
  undoStack: [] as CardPlacement[][],
};

export const useRunStore = create<RunState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setStep: (step) => set({ step }),
      
      setTemplate: async (template) => {
        const checksum = await generateChecksum(template);
        const placements: CardPlacement[] = template.cards.map((card) => ({
          cardId: card.id,
          categoryId: null,
          isUnsure: false,
        }));
        
        set({
          template,
          templateChecksum: checksum,
          cardPlacements: placements,
          step: 'participant',
        });
      },
      
      setParticipantName: (name) => set({ participantName: name }),
      
      startSession: () =>
        set({
          startedAt: new Date().toISOString(),
          step: 'sorting',
        }),
      
      moveCard: (cardId, categoryId, isUnsure = false) =>
        set((state) => {
          const newPlacements = state.cardPlacements.map((p) =>
            p.cardId === cardId ? { ...p, categoryId, isUnsure } : p
          );
          return {
            cardPlacements: newPlacements,
            movesCount: state.movesCount + 1,
            undoStack: [...state.undoStack, state.cardPlacements],
          };
        }),
      
      undo: () =>
        set((state) => {
          if (state.undoStack.length === 0) return state;
          const newStack = [...state.undoStack];
          const previousPlacements = newStack.pop()!;
          return {
            cardPlacements: previousPlacements,
            undoStack: newStack,
            undoCount: state.undoCount + 1,
          };
        }),
      
      reset: () => set(initialState),
      
      generateResult: async () => {
        const state = get();
        if (!state.template || !state.templateChecksum) {
          throw new Error('No template loaded');
        }
        
        const completedAt = new Date().toISOString();
        const startTime = state.startedAt ? new Date(state.startedAt).getTime() : Date.now();
        const endTime = new Date(completedAt).getTime();
        
        const groups: OutputGroup[] = state.template.categories.map((cat) => ({
          categoryId: cat.id,
          cardIdsInOrder: state.cardPlacements
            .filter((p) => p.categoryId === cat.id && !p.isUnsure)
            .map((p) => p.cardId),
        }));
        
        const unsureCardIds = state.cardPlacements
          .filter((p) => p.isUnsure)
          .map((p) => p.cardId);
        
        return {
          schemaVersion: '1.0.0',
          templateId: state.template.templateId,
          templateChecksumSha256: state.templateChecksum,
          participant: { name: state.participantName },
          session: {
            startedAt: state.startedAt || completedAt,
            completedAt,
            durationMs: endTime - startTime,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            userAgent: navigator.userAgent,
            viewport: { w: window.innerWidth, h: window.innerHeight },
          },
          output: { groups, unsureCardIds },
          telemetry: {
            movesCount: state.movesCount,
            undoCount: state.undoCount,
          },
        };
      },
      
      getUnsortedCards: () => {
        const state = get();
        return state.cardPlacements
          .filter((p) => p.categoryId === null && !p.isUnsure)
          .map((p) => p.cardId);
      },
      
      getSortedCards: () => {
        const state = get();
        if (!state.template) return [];
        return state.template.categories.map((cat) => ({
          categoryId: cat.id,
          cardIdsInOrder: state.cardPlacements
            .filter((p) => p.categoryId === cat.id && !p.isUnsure)
            .map((p) => p.cardId),
        }));
      },
      
      getUnsureCards: () => {
        const state = get();
        return state.cardPlacements
          .filter((p) => p.isUnsure)
          .map((p) => p.cardId);
      },
      
      getProgress: () => {
        const state = get();
        const total = state.cardPlacements.length;
        const sorted = state.cardPlacements.filter(
          (p) => p.categoryId !== null || p.isUnsure
        ).length;
        return { sorted, total };
      },
    }),
    {
      name: 'run-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
