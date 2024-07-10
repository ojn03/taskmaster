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
  setAccessToken: (token: string) => void;
  erase: () => void;
}

export const SessionStore = create<sessionState>((set) => ({
  user_id: "",
  access_token: "",
  setCurrentUser(user_id) {
    set({ user_id });
  },
  setAccessToken(token) {
    set({ access_token: token });
  },
  erase() {
    set({ user_id: "", access_token: "" });
  },
}));
