import { create } from "zustand";

interface sessionState {
  user_id: string; //TODO have this store a User object instead
  setCurrentUser: (id: string) => void;

  //Project state
  currentProject: string;
  setProject: (id: string) => void;

  eraseSessionStore: () => void;
}

export const SessionStore = create<sessionState>((set) => ({
  currentProject: "",
  setProject(id) {
    console.log("setting current proj_id to ", id);
    set({ currentProject: id });
  },
  user_id: "",
  setCurrentUser(user_id) {
    console.log("setting current user_id to ", user_id);
    set({ user_id });
  },
  eraseSessionStore() {
    set({ user_id: "", currentProject: "" });
  },
}));
