import { create } from "zustand";

type SignalEntry = {
  text: string;
  timestamp: number;
};

type SignalStore = {
  history: SignalEntry[];
  addSignal: (text: string) => void;
  clearHistory: () => void;
  lastSignal: SignalEntry | null;
};

export const useSignalStore = create<SignalStore>((set, get) => ({
  history: [],
  addSignal: (text) => {
    const entry = { text, timestamp: Date.now() };
    set((state) => ({
      history: [...state.history, entry],
    }));
  },
  clearHistory: () => set({ history: [] }),
  get lastSignal() {
    const h = get().history;
    return h.length ? h[h.length - 1] : null;
  },
}));