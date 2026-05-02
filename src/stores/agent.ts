import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AgentState {
  isRunning: boolean;
  currentTask: string | null;
  taskTypes: string[];
  frequency: "hourly" | "daily" | "weekly";
  setRunning: (running: boolean) => void;
  setCurrentTask: (task: string | null) => void;
  setTaskTypes: (types: string[]) => void;
  setFrequency: (freq: "hourly" | "daily" | "weekly") => void;
}

export const useAgentStore = create<AgentState>()(
  persist(
    (set) => ({
      isRunning: false,
      currentTask: null,
      taskTypes: ["content_creation"],
      frequency: "daily",
      setRunning: (running) => set({ isRunning: running }),
      setCurrentTask: (task) => set({ currentTask: task }),
      setTaskTypes: (types) => set({ taskTypes: types }),
      setFrequency: (freq) => set({ frequency: freq }),
    }),
    {
      name: "agent-store",
    }
  )
);

interface UIState {
  sidebarOpen: boolean;
  theme: "light" | "dark";
  toggleSidebar: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: "dark",
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "ui-store",
    }
  )
);