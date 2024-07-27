import { create } from "zustand";

interface ProjectState {
  currentProject: string;
  setProject: (id: string) => void;
}

export const ProjectStore = create<ProjectState>((set) => ({
  currentProject: "",
  setProject(id) {
    console.log("setting current proj_id to ", id);
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
    console.log("setting current user_id to ", user_id);
    set({ user_id });
  },
  erase() {
    set({ user_id: "", access_token: "" });
  },
}));
