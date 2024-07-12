import { create } from "zustand";

interface ProjectState {
  currentProject: string;
  setProject: (id: string) => void;
}

export const ProjectStore = create<ProjectState>((set) => ({
  currentProject: "",
  setProject(id) {
    set({ currentProject: id });
  },
}));

interface sessionState {
  user_id: string; //TODO have this store a User object instead
  access_token: string;
  setCurrentUser: (id: string) => void;
  erase: () => void;
}

export const SessionStore = create<sessionState>((set) => ({
  user_id: "",
  access_token: "",
  setCurrentUser(user_id) {
    set({ user_id });
  },
  erase() {
    set({ user_id: "", access_token: "" });
  },
}));
