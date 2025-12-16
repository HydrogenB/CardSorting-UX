import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Study, Category, Card, StudyTemplate } from '@/domain/model';
import { generateTemplateId, generateCategoryId, generateCardId } from '@/domain/ids';

interface BuilderState {
  study: Study;
  categories: Category[];
  cards: Card[];
  
  // Actions
  setStudy: (study: Partial<Study>) => void;
  addCategory: (label: string, description?: string, image?: string) => void;
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id'>>) => void;
  removeCategory: (id: string) => void;
  reorderCategories: (startIndex: number, endIndex: number) => void;
  addCard: (label: string, description?: string, image?: string) => void;
  updateCard: (id: string, updates: Partial<Omit<Card, 'id'>>) => void;
  removeCard: (id: string) => void;
  reorderCards: (startIndex: number, endIndex: number) => void;
  reset: () => void;
  exportTemplate: () => StudyTemplate;
}

const defaultStudy: Study = {
  title: '',
  description: '',
  language: 'en',
  sortType: 'closed',
  settings: {
    randomizeCardOrder: true,
    allowCreateCategories: false,
    requireAllCardsSorted: true,
    enableUnsureBucket: true,
    unsureBucketLabel: 'Unsure / Doesn\'t fit',
  },
  instructionsMarkdown: 'Drag each card into the group that best matches where you\'d expect to find it.',
};

const initialState = {
  study: defaultStudy,
  categories: [] as Category[],
  cards: [] as Card[],
};

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setStudy: (updates) =>
        set((state) => ({
          study: { ...state.study, ...updates },
        })),
      
      addCategory: (label, description = '', image?: string) =>
        set((state) => ({
          categories: [
            ...state.categories,
            { id: generateCategoryId(), label, description, image },
          ],
        })),
      
      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === id ? { ...cat, ...updates } : cat
          ),
        })),
      
      removeCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id),
        })),
      
      reorderCategories: (startIndex, endIndex) =>
        set((state) => {
          const result = Array.from(state.categories);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { categories: result };
        }),
      
      addCard: (label, description = '', image?: string) =>
        set((state) => ({
          cards: [
            ...state.cards,
            { id: generateCardId(), label, description, image, meta: {} },
          ],
        })),
      
      updateCard: (id, updates) =>
        set((state) => ({
          cards: state.cards.map((card) =>
            card.id === id ? { ...card, ...updates } : card
          ),
        })),
      
      removeCard: (id) =>
        set((state) => ({
          cards: state.cards.filter((card) => card.id !== id),
        })),
      
      reorderCards: (startIndex, endIndex) =>
        set((state) => {
          const result = Array.from(state.cards);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { cards: result };
        }),
      
      reset: () => set(initialState),
      
      exportTemplate: () => {
        const { study, categories, cards } = get();
        return {
          schemaVersion: '1.0.0',
          templateId: generateTemplateId(),
          study,
          categories,
          cards,
          createdAt: new Date().toISOString(),
        };
      },
    }),
    {
      name: 'builder-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
