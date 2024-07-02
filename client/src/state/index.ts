import { create } from "zustand";

interface ProjectState {
  currentProject: string;
  setProject: (id: string) => void;
}

export const ProjectStateStore = create<ProjectState>((set) => ({
  currentProject: "",
  setProject(id) {
    set({ currentProject: id });
  },
}));
