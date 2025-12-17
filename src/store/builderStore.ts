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
  addCategory: (label: string, description?: string, image?: string) => string; // returns id
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id'>>) => void;
  removeCategory: (id: string) => Category | undefined; // returns removed category
  restoreCategory: (category: Category, index?: number) => void;
  reorderCategories: (startIndex: number, endIndex: number) => void;
  addCard: (label: string, description?: string, image?: string) => string; // returns id
  updateCard: (id: string, updates: Partial<Omit<Card, 'id'>>) => void;
  removeCard: (id: string) => Card | undefined; // returns removed card
  restoreCard: (card: Card, index?: number) => void;
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
      
      addCategory: (label, description = '', image?: string) => {
        const id = generateCategoryId();
        set((state) => ({
          categories: [
            ...state.categories,
            { id, label, description, image },
          ],
        }));
        return id;
      },
      
      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === id ? { ...cat, ...updates } : cat
          ),
        })),
      
      removeCategory: (id) => {
        const category = get().categories.find((cat) => cat.id === id);
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id),
        }));
        return category;
      },
      
      restoreCategory: (category, index) =>
        set((state) => {
          const categories = [...state.categories];
          if (index !== undefined && index >= 0 && index <= categories.length) {
            categories.splice(index, 0, category);
          } else {
            categories.push(category);
          }
          return { categories };
        }),
      
      reorderCategories: (startIndex, endIndex) =>
        set((state) => {
          const result = Array.from(state.categories);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { categories: result };
        }),
      
      addCard: (label, description = '', image?: string) => {
        const id = generateCardId();
        set((state) => ({
          cards: [
            ...state.cards,
            { id, label, description, image, meta: {} },
          ],
        }));
        return id;
      },
      
      updateCard: (id, updates) =>
        set((state) => ({
          cards: state.cards.map((card) =>
            card.id === id ? { ...card, ...updates } : card
          ),
        })),
      
      removeCard: (id) => {
        const card = get().cards.find((c) => c.id === id);
        set((state) => ({
          cards: state.cards.filter((c) => c.id !== id),
        }));
        return card;
      },
      
      restoreCard: (card, index) =>
        set((state) => {
          const cards = [...state.cards];
          if (index !== undefined && index >= 0 && index <= cards.length) {
            cards.splice(index, 0, card);
          } else {
            cards.push(card);
          }
          return { cards };
        }),
      
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
