import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SearchFilter {
  sortBy: 'date' | 'sales' | 'price';
  sortOrder: 'asc' | 'desc';
  category?: string;
  style?: string;
  format?: string;
  color?: string;
  industry?: string;
}

interface SearchStore {
  searchHistory: string[];
  currentFilters: SearchFilter;
  addToHistory: (query: string) => void;
  removeFromHistory: (query: string) => void;
  clearHistory: () => void;
  setFilters: (filters: Partial<SearchFilter>) => void;
  resetFilters: () => void;
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      searchHistory: [],
      currentFilters: {
        sortBy: 'date',
        sortOrder: 'desc',
      },
      addToHistory: (query) => {
        const history = get().searchHistory;
        const filtered = history.filter(h => h !== query);
        set({ searchHistory: [query, ...filtered].slice(0, 10) });
      },
      removeFromHistory: (query) => set({
        searchHistory: get().searchHistory.filter(h => h !== query),
      }),
      clearHistory: () => set({ searchHistory: [] }),
      setFilters: (filters) => set({
        currentFilters: { ...get().currentFilters, ...filters },
      }),
      resetFilters: () => set({
        currentFilters: {
          sortBy: 'date',
          sortOrder: 'desc',
        },
      }),
    }),
    {
      name: 'iconmarket-search',
    }
  )
);