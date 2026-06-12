import { create } from 'zustand';
import { FilterOptions } from '@/types';

interface FilterStore {
  filters: FilterOptions;
  searchQuery: string;
  setFilters: (filters: Partial<FilterOptions>) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  filters: {
    sortBy: 'date',
    sortOrder: 'desc',
  },
  searchQuery: '',
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },
  resetFilters: () => {
    set({
      filters: {
        sortBy: 'date',
        sortOrder: 'desc',
      },
      searchQuery: '',
    });
  },
}));
