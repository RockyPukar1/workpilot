import { create } from "zustand";

interface AppState {
  currentView:
    | "dashboard"
    | "clipboard"
    | "notes"
    | "templates"
    | "screenshots";
  setCurrentView: (view: AppState["currentView"]) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentView: "dashboard",
  setCurrentView: (view) => set({ currentView: view }),

  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
