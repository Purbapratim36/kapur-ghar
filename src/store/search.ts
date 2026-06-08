import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchStore {
  isOpen: boolean;
  query: string;
  recentSearches: string[];
  open: () => void;
  close: () => void;
  setQuery: (query: string) => void;
  addToHistory: (query: string) => void;
  clearHistory: () => void;
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      isOpen: false,
      query: "",
      recentSearches: [],

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false, query: "" }),
      setQuery: (query) => set({ query }),

      addToHistory: (query) => {
        if (!query.trim()) return;
        set((state) => ({
          recentSearches: [
            query,
            ...state.recentSearches.filter((s) => s !== query),
          ].slice(0, 10),
        }));
      },

      clearHistory: () => set({ recentSearches: [] }),
    }),
    {
      name: "kapur-ghar-search",
      partialize: (state) => ({ recentSearches: state.recentSearches }),
    }
  )
);
